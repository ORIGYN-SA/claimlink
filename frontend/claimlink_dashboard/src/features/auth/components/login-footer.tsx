import { Link } from "@tanstack/react-router";

export function LoginFooter() {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs leading-relaxed">
        <span className="text-gray-300">BY USING THIS PRODUCT YOU AGREE TO OUR</span>
        <br />
        <Link
          to="/terms"
          target="_blank"
          className="text-gray-300 underline hover:text-white transition-colors uppercase tracking-wider"
        >
          TERMS AND CONDITIONS AND PRIVACY POLICY
        </Link>
      </p>
    </div>
  )
}
