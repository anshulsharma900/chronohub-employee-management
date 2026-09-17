import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Leave from "./models/Leave.js";
import Reimbursement from "./models/Reimbursement.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chronohub");
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Leave.deleteMany({});
    await Reimbursement.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const admin = new User({
      name: "Admin User",
      email: "admin@chronohub.com",
      password: "admin123",
      phone: "1234567890",
      department: "Administration",
      designation: "System Administrator",
      role: "admin",
    });
    await admin.save();
    console.log("Created admin user");

    // Create manager users
    const manager1 = new User({
      name: "John Manager",
      email: "manager@chronohub.com",
      password: "manager123",
      phone: "1234567891",
      department: "HR",
      designation: "HR Manager",
      role: "manager",
    });
    await manager1.save();

    const manager2 = new User({
      name: "Sarah Lead",
      email: "sarah@chronohub.com",
      password: "manager123",
      phone: "1234567892",
      department: "Engineering",
      designation: "Team Lead",
      role: "manager",
    });
    await manager2.save();
    console.log("Created manager users");

    // Create employee users
    const employeeData = [
      {
        name: "Alice Johnson",
        email: "alice@chronohub.com",
        password: "employee123",
        phone: "1234567893",
        department: "Engineering",
        designation: "Software Engineer",
        role: "employee",
      },
      {
        name: "Bob Smith",
        email: "bob@chronohub.com",
        password: "employee123",
        phone: "1234567894",
        department: "Engineering",
        designation: "Frontend Developer",
        role: "employee",
      },
      {
        name: "Charlie Brown",
        email: "charlie@chronohub.com",
        password: "employee123",
        phone: "1234567895",
        department: "Marketing",
        designation: "Marketing Specialist",
        role: "employee",
      },
      {
        name: "Diana Ross",
        email: "diana@chronohub.com",
        password: "employee123",
        phone: "1234567896",
        department: "HR",
        designation: "HR Executive",
        role: "employee",
      },
      {
        name: "Edward Miller",
        email: "edward@chronohub.com",
        password: "employee123",
        phone: "1234567897",
        department: "Finance",
        designation: "Accountant",
        role: "employee",
      },
      {
        name: "Fiona Davis",
        email: "fiona@chronohub.com",
        password: "employee123",
        phone: "1234567898",
        department: "Engineering",
        designation: "Backend Developer",
        role: "employee",
      },
      {
        name: "George Wilson",
        email: "george@chronohub.com",
        password: "employee123",
        phone: "1234567899",
        department: "Sales",
        designation: "Sales Executive",
        role: "employee",
      },
      {
        name: "Hannah Moore",
        email: "hannah@chronohub.com",
        password: "employee123",
        phone: "1234567900",
        department: "Design",
        designation: "UI/UX Designer",
        role: "employee",
      },
    ];

    const employees = [];
    for (const emp of employeeData) {
      const employee = new User(emp);
      await employee.save();
      employees.push(employee);
    }
    console.log("Created employee users");

    // Create leave requests
    const leaveRequests = [
      {
        employee: employees[0]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2024-01-15"),
        toDate: new Date("2024-01-16"),
        reason: "Feeling unwell",
        status: "approved",
        approvedBy: manager1._id,
      },
      {
        employee: employees[1]._id,
        leaveType: "Annual Leave",
        fromDate: new Date("2024-02-01"),
        toDate: new Date("2024-02-05"),
        reason: "Family vacation",
        status: "approved",
        approvedBy: manager2._id,
      },
      {
        employee: employees[2]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2024-02-10"),
        toDate: new Date("2024-02-12"),
        reason: "Personal work",
        status: "pending",
      },
      {
        employee: employees[3]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2024-02-15"),
        toDate: new Date("2024-02-16"),
        reason: "Doctor appointment",
        status: "pending",
      },
      {
        employee: employees[4]._id,
        leaveType: "Annual Leave",
        fromDate: new Date("2024-03-01"),
        toDate: new Date("2024-03-10"),
        reason: "Wedding anniversary trip",
        status: "pending",
      },
      {
        employee: employees[5]._id,
        leaveType: "Personal Leave",
        fromDate: new Date("2024-01-20"),
        toDate: new Date("2024-01-25"),
        reason: "Home renovation",
        status: "rejected",
      },
      {
        employee: employees[6]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2024-02-20"),
        toDate: new Date("2024-02-21"),
        reason: "Moving to new house",
        status: "approved",
        approvedBy: manager1._id,
      },
      {
        employee: employees[7]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2024-02-25"),
        toDate: new Date("2024-02-27"),
        reason: "Flu",
        status: "pending",
      },
    ];

    await Leave.insertMany(leaveRequests);
    console.log("Created leave requests");

    // Create reimbursement claims
    const reimbursementClaims = [
      {
        employee: employees[0]._id,
        amount: 150.50,
        category: "travel",
        description: "Uber to client meeting",
        status: "approved",
        reviewedBy: manager1._id,
        reviewedAt: new Date("2024-01-20"),
      },
      {
        employee: employees[1]._id,
        amount: 45.00,
        category: "meals",
        description: "Team lunch during project sprint",
        status: "paid",
        reviewedBy: manager2._id,
        reviewedAt: new Date("2024-01-18"),
        paidBy: admin._id,
        paidAt: new Date("2024-01-22"),
      },
      {
        employee: employees[2]._id,
        amount: 299.99,
        category: "software",
        description: "Annual IDE license subscription",
        status: "pending",
      },
      {
        employee: employees[3]._id,
        amount: 75.00,
        category: "training",
        description: "Online course on React advanced patterns",
        status: "pending",
      },
      {
        employee: employees[4]._id,
        amount: 500.00,
        category: "equipment",
        description: "Ergonomic keyboard and mouse",
        status: "rejected",
        reviewedBy: manager1._id,
        reviewedAt: new Date("2024-02-01"),
        rejectionReason: "Company provides standard equipment",
      },
      {
        employee: employees[5]._id,
        amount: 89.99,
        category: "software",
        description: "Postman Pro subscription",
        status: "approved",
        reviewedBy: manager2._id,
        reviewedAt: new Date("2024-02-05"),
      },
      {
        employee: employees[0]._id,
        amount: 210.00,
        category: "travel",
        description: "Conference registration fee",
        status: "pending",
      },
      {
        employee: employees[6]._id,
        amount: 35.50,
        category: "meals",
        description: "Client dinner",
        status: "paid",
        reviewedBy: manager1._id,
        reviewedAt: new Date("2024-01-25"),
        paidBy: admin._id,
        paidAt: new Date("2024-01-28"),
      },
    ];

    await Reimbursement.insertMany(reimbursementClaims);
    console.log("Created reimbursement claims");

    console.log("\n✅ Seed data created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("Admin: admin@chronohub.com / admin123");
    console.log("Manager: manager@chronohub.com / manager123");
    console.log("Employee: alice@chronohub.com / employee123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
