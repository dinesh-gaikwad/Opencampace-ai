package com.opencampus.ai;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiTutorController {
    private final AiTutorService service;
    public AiTutorController(AiTutorService service) { this.service = service; }

    @PostMapping("/ask")
    public Answer ask(@Valid @RequestBody Question request) {
        return service.answer(request);
    }

    public record Question(
            @NotBlank @Size(max = 6000) String question,
            @Size(max = 12000) String lessonContext,
            @Size(max = 40) String language,
            @Size(max = 40) String level) {}
    public record Answer(String answer, String mode, String safetyNote) {}
}
