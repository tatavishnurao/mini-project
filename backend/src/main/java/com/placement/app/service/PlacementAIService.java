package com.placement.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.app.dto.AIAnalysisRequest;
import com.placement.app.dto.AIAnalysisResponse;
import com.placement.app.entity.Student;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class PlacementAIService {

    private final StudentService studentService;
    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PlacementAIService(
            StudentService studentService,
            @Value("${langchain4j.groq.chat-model.api-key}") String apiKey,
            @Value("${langchain4j.groq.chat-model.model-name}") String modelName,
            @Value("${langchain4j.groq.chat-model.base-url}") String baseUrl) {
        this.studentService = studentService;
        this.chatLanguageModel = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName(modelName)
                .baseUrl(baseUrl)
                .temperature(0.7)
                .build();
    }

    public AIAnalysisResponse analyze(AIAnalysisRequest request) {
        Student student = studentService.getStudentById(request.getStudentId());

        String systemPrompt = "You are an expert AI recruiter. Evaluate the student's skills against the given job description. "
                +
                "Respond ONLY in valid JSON format with the following keys exactly as listed: " +
                "\"matchScore\" (integer 0-100), " +
                "\"missingSkills\" (array of strings), " +
                "\"hiringVerdict\" (short string explaining why). No markup, no markdown formatting, just pure JSON string.";

        String userPrompt = String.format("Student Skills: %s\nJob Description: %s",
                student.getSkills(), request.getJobDescription());

        String fullPrompt = systemPrompt + "\n\n" + userPrompt;

        String jsonResponse;
        try {
            System.out.println("[AI] Sending prompt to Gemini...");
            jsonResponse = chatLanguageModel.generate(fullPrompt);
            System.out.println("[AI] Gemini raw response: " + jsonResponse);
        } catch (Exception e) {
            System.err.println("[AI] Gemini API call FAILED: " + e.getMessage());
            e.printStackTrace();
            // Return a fallback response instead of crashing
            AIAnalysisResponse fallback = new AIAnalysisResponse();
            fallback.setMatchScore(0);
            fallback.setMissingSkills(Collections.singletonList("AI service unavailable"));
            fallback.setHiringVerdict("Analysis failed: " + e.getMessage());
            return fallback;
        }

        try {
            String cleanJson = jsonResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            return objectMapper.readValue(cleanJson, AIAnalysisResponse.class);
        } catch (Exception e) {
            System.err.println("[AI] JSON parse failed for: " + jsonResponse);
            AIAnalysisResponse fallback = new AIAnalysisResponse();
            fallback.setMatchScore(0);
            fallback.setMissingSkills(Collections.singletonList("Parse error"));
            fallback.setHiringVerdict("Could not parse AI response: " + jsonResponse);
            return fallback;
        }
    }
}
