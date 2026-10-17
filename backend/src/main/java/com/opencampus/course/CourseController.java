package com.opencampus.course;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseRepository courses;
    public CourseController(CourseRepository courses) { this.courses = courses; }

    @GetMapping
    public List<CourseResponse> list(@RequestParam(required = false) String category) {
        var result = (category == null || category.isBlank())
                ? courses.findAll()
                : courses.findByCategoryIgnoreCaseOrderByFeaturedDescTitleAsc(category.trim());
        return result.stream().map(CourseResponse::from).toList();
    }

    @GetMapping("/{slug}")
    public CourseResponse getBySlug(@PathVariable String slug) {
        return courses.findAll().stream()
                .filter(c -> c.getSlug().equals(slug))
                .findFirst()
                .map(CourseResponse::from)
                .orElseThrow(() -> new CourseNotFoundException(slug));
    }

    public record CourseResponse(Long id, String slug, String title, String category,
            String level, String description, String durationLabel, int lessonsCount,
            boolean featured) {
        static CourseResponse from(Course c) {
            return new CourseResponse(c.getId(), c.getSlug(), c.getTitle(), c.getCategory(),
                    c.getLevel(), c.getDescription(), c.getDurationLabel(),
                    c.getLessonsCount(), c.isFeatured());
        }
    }
}
