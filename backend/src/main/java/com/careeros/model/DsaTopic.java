package com.careeros.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dsa_topics")
public class DsaTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "json")
    private String prerequisites;

    @Column(name = "leetcode_id", length = 50)
    private String leetcodeId;

    public DsaTopic() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public String getLeetcodeId() { return leetcodeId; }
    public void setLeetcodeId(String leetcodeId) { this.leetcodeId = leetcodeId; }

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}
