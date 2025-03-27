package com.smart_money.repository;

import com.smart_money.model.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpensesRepository extends JpaRepository<Expenses, Long> {
}
