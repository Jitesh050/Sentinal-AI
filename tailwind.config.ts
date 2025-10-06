
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				cyber: {
					dark: '#221F26',
					darker: '#1A1F2C',
					blue: '#0FA0CE',
					cyan: '#33C3F0',
					purple: '#8B5CF6',
					magenta: '#D946EF',
					orange: '#F97316',
					red: '#EA384C',
					green: '#10B981',
					subtle: '#403E43',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"pulse-glow": {
					"0%, 100%": { boxShadow: "0 0 2px rgba(51, 195, 240, 0.2), 0 0 4px rgba(51, 195, 240, 0.2)" },
					"50%": { boxShadow: "0 0 8px rgba(51, 195, 240, 0.6), 0 0 16px rgba(51, 195, 240, 0.4)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"threat-pulse": {
					"0%, 100%": { opacity: "0.85" },
					"50%": { opacity: "1" }
				},
				"matrix-fall": {
					"0%": { transform: "translateY(-100%)", opacity: "0" },
					"50%": { opacity: "1" },
					"100%": { transform: "translateY(1000%)", opacity: "0" }
				},
				"rotate-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				},
				"dash": {
					"to": { strokeDashoffset: "-20" }
				},
				"pulse-fade": {
					"0%": { opacity: "1", transform: "scale(1)" },
					"50%": { opacity: "0.5", transform: "scale(1.2)" },
					"100%": { opacity: "0", transform: "scale(1.5)" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-glow": "pulse-glow 3s infinite ease-in-out",
				"float": "float 6s infinite ease-in-out",
				"threat-pulse": "threat-pulse 2s infinite",
				"matrix-fall": "matrix-fall 8s linear infinite",
				"rotate-slow": "rotate-slow 12s linear infinite",
				"dash": "dash 20s linear infinite",
				"pulse-fade": "pulse-fade 2s ease-out infinite"
			},
			fontFamily: {
				mono: ["JetBrains Mono", "monospace"],
				sans: ["Inter", "sans-serif"]
			},
			// Add opacity to the safelist to fix the issue with to-cyber-purple/2
			safelist: [
				'from-cyber-blue/5',
				'from-cyber-blue/10',
				'to-cyber-purple/2',
				'to-cyber-purple/5'
			]
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

