package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.entities.Employee;
import com.example.repository.LeaveRepository;

@Controller
public class LeaveController {
	
	@Autowired
	private LeaveRepository leaveRepo;
	
	@GetMapping("/")
	public String load(Model model) {
		model.addAttribute("emp", new Employee());
		return "leave";
	}
	
	
	
	@GetMapping("/hr")
	public String loadhr() {

		return "hr";
	}
	
	@MessageMapping("/leaveApproval/{id}/{status}")
	@SendTo("/topic/greeting")
	public String greeting(@DestinationVariable int id,
			@DestinationVariable String status) throws Exception {
		Employee employee = leaveRepo.findByEmpId(id);
		employee.setStatus(status);
		Employee savedEmployee = leaveRepo.save(employee);
		return savedEmployee.getStatus();
	}
	
	@MessageMapping("/saveEmpLeave")
	@SendTo("/topic/greetings")
	public Employee greeting(Employee emp) throws Exception {
		System.out.println("============"+emp);
		Employee savedEmployee = leaveRepo.save(emp);
		return savedEmployee;
	}
	
}
