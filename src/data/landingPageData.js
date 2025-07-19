import { Zap, PiggyBank, Shield, Smartphone, CreditCard, BarChart3, Eye, Lock, Users, CheckCircle,Clock } from "lucide-react";

export const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
  { href: "#about", label: "About" },
];

export const featuresData = [
  { icon: Zap, title: "Instant Transfers", description: "Send money instantly to anyone, anywhere. No delays, no hassles.", color: "text-banking-primary" },
  { icon: PiggyBank, title: "Smart Savings", description: "Automated savings that work in the background to grow your wealth.", color: "text-banking-accent" },
  { icon: Shield, title: "Bank-Level Security", description: "Your money is protected with military-grade encryption and fraud monitoring.", color: "text-banking-success" },
  { icon: Smartphone, title: "Mobile First", description: "Full banking functionality in your pocket. Manage everything on the go.", color: "text-banking-primary" },
  { icon: CreditCard, title: "Smart Cards", description: "Virtual and physical cards with real-time spending controls and rewards.", color: "text-banking-accent" },
  { icon: BarChart3, title: "Spending Insights", description: "Understand your spending patterns with intelligent categorization and analytics.", color: "text-banking-success" }
];

export const securityData = [
  { icon: Shield, title: "256-bit SSL Encryption", description: "All data is encrypted using bank-grade SSL technology" },
  { icon: Eye, title: "24/7 Fraud Monitoring", description: "AI-powered systems monitor every transaction for suspicious activity" },
  { icon: Lock, title: "Biometric Authentication", description: "Secure access using fingerprint and face recognition" },
  { icon: Users, title: "FDIC Insured", description: "Your deposits are protected up to $250,000 by FDIC insurance" }
];

export const heroStats = [
    { icon: CheckCircle, text: "FDIC Insured" },
    { icon: Shield, text: "Bank-Level Security" },
    { icon: Clock, text: "24/7 Support" },
];