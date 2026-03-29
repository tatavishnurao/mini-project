package com.placement.app.controller;

import com.placement.app.dto.AIAnalysisRequest;
import com.placement.app.dto.AIAnalysisResponse;
import com.placement.app.service.PlacementAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AIAnalyzerController {

    private final PlacementAIService placementAIService;

    @PostMapping("/analyze")
    public AIAnalysisResponse analyze(@RequestBody AIAnalysisRequest request) {
        return placementAIService.analyze(request);
    }
}
