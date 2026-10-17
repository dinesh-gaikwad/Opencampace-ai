package com.opencampus.course;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 100)
    private String slug;
    @Column(nullable = false, length = 180)
    private String title;
    @Column(nullable = false, length = 80)
    private String category;
    @Column(nullable = false, length = 40)
    private String level;
    @Column(nullable = false, columnDefinition = "text")
    private String description;
    @Column(name = "duration_label", nullable = false, length = 60)
    private String durationLabel;
    @Column(name = "lessons_count", nullable = false)
    private int lessonsCount;
    @Column(nullable = false)
    private boolean featured;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Course() {}

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getLevel() { return level; }
    public String getDescription() { return description; }
    public String getDurationLabel() { return durationLabel; }
    public int getLessonsCount() { return lessonsCount; }
    public boolean isFeatured() { return featured; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
