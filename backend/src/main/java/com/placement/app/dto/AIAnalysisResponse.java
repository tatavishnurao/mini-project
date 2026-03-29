package com.placement.app.dto;

import lombok.Data;
import java.util.List;

@Data
public class AIAnalysisResponse {
    private int matchScore;
    private List<String> missingSkills;
    private String hiringVerdict;
}
