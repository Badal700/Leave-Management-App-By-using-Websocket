package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entities.Employee;

@Repository
public interface LeaveRepository extends JpaRepository<Employee, Integer> {

	public Employee findByEmpId(int empId);

}
