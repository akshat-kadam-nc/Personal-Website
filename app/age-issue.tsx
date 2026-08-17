"use client";

type AgeIssueProps = {
  className?: string;
};

function currentIssueNumber(now = new Date()) {
  let age = now.getFullYear() - 1993;
  const birthdayHasPassed = now.getMonth() > 10 || (now.getMonth() === 10 && now.getDate() >= 20);

  if (!birthdayHasPassed) age -= 1;
  return String(age).padStart(2, "0");
}

export function AgeIssue({ className }: AgeIssueProps) {
  return <span className={className} suppressHydrationWarning>{currentIssueNumber()}</span>;
}
