package com.opencampus.course;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCategoryIgnoreCaseOrderByFeaturedDescTitleAsc(String category);
}
