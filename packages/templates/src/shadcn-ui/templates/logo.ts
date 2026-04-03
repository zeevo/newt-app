export default {
  filename: "packages/ui/src/components/logo.tsx",
  template: `import { cn } from "@<%= projectName %>/ui/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      width="196"
      height="138"
      viewBox="0 0 196 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      <path
        d="M98 35C102.665 35 107.243 35.2232 111.707 35.6514C111.243 38.1972 111 40.8202 111 43.5C111 67.5244 130.476 87 154.5 87C165.156 87 174.914 83.1658 182.478 76.8057C183.476 79.9455 184 83.186 184 86.5C184 114.943 145.496 138 98 138C50.5035 138 12 114.943 12 86.5C12 83.1861 12.5228 79.9454 13.5215 76.8057C21.0851 83.1661 30.8441 87 41.5 87C65.5244 87 85 67.5244 85 43.5C85 40.8202 84.7559 38.1973 84.292 35.6514C88.7559 35.2232 93.3345 35 98 35ZM38.5 0C59.763 0 77 17.237 77 38.5C77 59.763 59.763 77 38.5 77C17.237 77 0 59.763 0 38.5C0 17.237 17.237 0 38.5 0ZM157.5 0C178.763 0 196 17.237 196 38.5C196 59.763 178.763 77 157.5 77C136.237 77 119 59.763 119 38.5C119 17.237 136.237 0 157.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}`,
};
