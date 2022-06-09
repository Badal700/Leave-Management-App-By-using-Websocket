package com.example.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.entities.Employee;
import com.example.repository.LeaveRepository;

@Controller
public class LeaveController {
	
	private final SimpMessagingTemplate template;
	@Autowired
	private LeaveRepository leaveRepo;

	public LeaveController(SimpMessagingTemplate template) {
		this.template = template;
	}
	
	 
	
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
	public void greeting(@DestinationVariable int id,
			@DestinationVariable String status) throws Exception {
		Employee employee = leaveRepo.findByEmpId(id);
		employee.setStatus(status);
		Employee savedEmployee = leaveRepo.save(employee);
		template.convertAndSend("/topic/greeting/"+id, savedEmployee.getStatus());
	}
	
	@MessageMapping("/saveEmpLeave")
	@SendTo("/topic/greetings")
	public Employee greeting(Employee emp) throws Exception {
		Employee savedEmployee = leaveRepo.save(emp);
		return savedEmployee;
	}
	
}
