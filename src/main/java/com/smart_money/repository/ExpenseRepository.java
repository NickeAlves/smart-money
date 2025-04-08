package com.smart_money.repository;

import com.smart_money.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Optional<Expense> findById(Long id);
    List<Expense> findAllByOwnerId(Long ownerId);

    @Query("SELECT SUM(e.value) FROM Expense e WHERE e.owner.id = :ownerId")
    Optional<BigDecimal> sumByOwnerId(Long ownerId);

}
