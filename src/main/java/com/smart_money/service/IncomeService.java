package com.smart_money.service;

import com.smart_money.dto.request.income.CreateIncomeDTO;
import com.smart_money.dto.request.income.UpdateIncomeDTO;
import com.smart_money.model.Income;
import com.smart_money.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {
    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<Income> findAll() {
        return incomeRepository.findAll();
    }

    public Optional<Income> findIncomeById(Long id) {
        return incomeRepository.findById(id);
    }

    public Income createIncome(CreateIncomeDTO dto) {
        Income income = new Income(dto.title(), dto.description(), dto.value(), dto.owner());
        return incomeRepository.save(income);
    }

    public Optional<Income> updateIncome(Long id, UpdateIncomeDTO dto) {
        return incomeRepository.findById(id).map(existingIncome -> {
            if (dto.title() != null) existingIncome.setTitle(dto.title());
            if (dto.description() != null) existingIncome.setDescription(dto.description());
            if (dto.value() >0 ) existingIncome.setValue(dto.value());
            return incomeRepository.save(existingIncome);
        });
    }

    public boolean deleteIncome(Long id) {
        if (incomeRepository.existsById(id)) {
            incomeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<BigDecimal> sumByOwnerId(Long ownerId) {
        return incomeRepository.sumByOwnerId(ownerId);
    }
}
