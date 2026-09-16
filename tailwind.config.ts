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
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
				},
				// LLM brand colors
				openai: 'hsl(var(--openai))',
				anthropic: 'hsl(var(--anthropic))',
				google: 'hsl(var(--google))',
				deepseek: 'hsl(var(--deepseek))',
				meta: 'hsl(var(--meta))',
				mistral: 'hsl(var(--mistral))',
				xai: 'hsl(var(--xai))',
				cohere: 'hsl(var(--cohere))',
				qwen: 'hsl(var(--qwen))',
				amazon: 'hsl(var(--amazon))',
				ai21: 'hsl(var(--ai21))',
				perplexity: 'hsl(var(--perplexity))',
				groq: 'hsl(var(--groq))',
				cerebras: 'hsl(var(--cerebras))',
				stability: 'hsl(var(--stability))',
				flux: 'hsl(var(--flux))',
				elevenlabs: 'hsl(var(--elevenlabs))',
				midjourney: 'hsl(var(--midjourney))',
				ideogram: 'hsl(var(--ideogram))',
				runway: 'hsl(var(--runway))',
				kuaishou: 'hsl(var(--kuaishou))',
				minimax: 'hsl(var(--minimax))'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elegant': 'var(--shadow-elegant)'
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					from: { opacity: '0', transform: 'translateX(-20px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 15px hsl(142 86% 50% / 0.15)' },
					'50%': { boxShadow: '0 0 30px hsl(142 86% 50% / 0.35)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out both',
				'slide-in-left': 'slide-in-left 0.5s ease-out both',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'scale-in': 'scale-in 0.3s ease-out both'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
