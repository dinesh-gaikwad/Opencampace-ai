package com.opencampus.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;

@Service
public class AiTutorService {
    private final String apiKey;
    private final String model;
    private final RestClient client = RestClient.create("https://api.openai.com");

    public AiTutorService(@Value("${app.ai.api-key}") String apiKey,
                          @Value("${app.ai.model}") String model) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model;
    }

    public AiTutorController.Answer answer(AiTutorController.Question request) {
        if (apiKey.isBlank()) {
            return new AiTutorController.Answer(demoAnswer(request), "demo",
                    "Demo mode: configure OPENAI_API_KEY for model-generated answers.");
        }
        try {
            String language = safe(request.language(), "English");
            String level = safe(request.level(), "Beginner");
            String context = safe(request.lessonContext(), "No lesson context provided.");
            Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of("role", "system", "content",
                        "You are OpenCampus AI, a patient tutor. Explain accurately at " + level
                        + " level, use " + language + ", give a short explanation, one example, "
                        + "and one practice question. If lesson context is supplied, prioritize it "
                        + "and say when the answer goes beyond it. Do not claim certainty when unsure. "
                        + "Lesson context: " + context),
                    Map.of("role", "user", "content", request.question())
                ),
                "temperature", 0.4
            );
            Map response = client.post().uri("/v1/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(body).retrieve().body(Map.class);
            List choices = (List) response.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            return new AiTutorController.Answer(String.valueOf(message.get("content")),
                    "openai", "AI can make mistakes. Verify important information.");
        } catch (Exception ex) {
            return new AiTutorController.Answer(
                "The AI provider is temporarily unavailable. Try again later, or ask a shorter question. "
                + "For learning safety, verify answers against your course material.",
                "fallback", "AI provider request failed; details are intentionally not exposed.");
        }
    }

    private String demoAnswer(AiTutorController.Question request) {
        String q = request.question().toLowerCase();
        if (q.contains("java") && q.contains("int")) {
            return "In Java, int stores a 32-bit signed whole number. Example: int score = 100; "
                + "Use int for ordinary whole-number calculations. Practice: what is the value of 7 / 2 in Java int arithmetic?";
        }
        if (q.contains("loop") || q.contains("for")) {
            return "A loop repeats code while a condition allows it. A for loop is useful when you know the iteration pattern. "
                + "Example: for (int i = 1; i <= 3; i++) { System.out.println(i); } "
                + "Practice: predict the output before running it.";
        }
        if (q.contains("react")) {
            return "React builds user interfaces from reusable components. A component returns UI, props pass data in, and state stores changing UI data. "
                + "Practice: sketch a CourseCard component that accepts a title prop.";
        }
        return "Let's break this down step by step. First, identify the goal of the question. "
            + "Next, connect it to one concept, then work through a small example and check the result. "
            + "Your question was: \"" + request.question() + "\". "
            + "This is the local demo tutor, not a live language model. Add OPENAI_API_KEY to enable model responses.";
    }

    private String safe(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
