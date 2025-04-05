package com.smart_money.repository;

import com.smart_money.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findAllByOwnerId(Long ownerId);

    @Query("SELECT SUM(i.value) FROM Income i WHERE i.owner.id = :ownerId")
    Optional<BigDecimal> sumByOwnerId(Long ownerId);
}
