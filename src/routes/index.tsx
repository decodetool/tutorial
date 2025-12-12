import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { MapPin, Calendar, Users, User, Sparkles, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
  beforeLoad: () => {
    document.title = 'Journeys';
  },
});

function HomeComponent() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent-teal/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header with glass effect */}
      <header className="relative px-6 py-8 border-b border-white/5 backdrop-blur-sm bg-background/50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2 bg-gradient-to-r from-accent-teal via-accent-cyan to-accent-teal bg-clip-text text-transparent">
            Journeys
          </h1>
          <p className="text-text-secondary">Micro-itinerary planner with lightweight social</p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 px-6 py-8 z-10">
        {/* Hero Section with Glass Card */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            <div className="bg-surface rounded-3xl p-8 border border-white/5">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-accent-cyan" />
                  <h2 className="text-2xl font-semibold text-text-primary">
                    Design System Preview
                  </h2>
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Experience Journeys with our premium dark mode theme, featuring Silk bottom sheets,
                  glass morphism effects, and fluid animations that feel buttery smooth.
                </p>
                <motion.button
                  onClick={() => setSheetOpen(true)}
                  className="relative px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Open Bottom Sheet Demo</span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                    style={{ opacity: 0.1 }}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Color Palette with 3D Cards */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-teal" />
            Color Palette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch color="#0C0F14" name="Background" index={0} />
            <ColorSwatch color="#11161C" name="Surface" index={1} />
            <ColorSwatch color="#2ED3B7" name="Accent Teal" glow index={2} />
            <ColorSwatch color="#22D3EE" name="Accent Cyan" glow index={3} />
          </div>
        </motion.div>

        {/* Navigation Preview with Glass */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Planned Tab Navigation
          </h3>
          <div className="bg-surface rounded-3xl p-6 border border-white/5">
            <div className="grid grid-cols-5 gap-2">
              <NavItem icon={<Sparkles size={20} />} label="Discover" active />
              <NavItem icon={<Calendar size={20} />} label="Itinerary" />
              <NavItem icon={<MapPin size={20} />} label="Map" />
              <NavItem icon={<Users size={20} />} label="Friends" />
              <NavItem icon={<User size={20} />} label="Profile" />
            </div>
          </div>
        </motion.div>

        {/* Typography with Glass */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4">Typography</h3>
          <div className="glass rounded-3xl p-6 shadow-inner-glow space-y-6">
            <div>
              <p className="text-text-secondary text-sm mb-1">Hero Number (32px)</p>
              <p className="text-[32px] font-bold font-mono text-transparent bg-gradient-to-r from-accent-teal to-accent-cyan bg-clip-text">
                3,142
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Primary Copy (18px)</p>
              <p className="text-lg text-text-primary">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">UI Text (14px)</p>
              <p className="text-sm text-text-secondary">
                Secondary information and labels
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Glass Morphism"
            description="Frosted glass effects with backdrop blur"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Smooth Animations"
            description="Spring physics and fluid transitions"
          />
          <FeatureCard
            icon={<MapPin className="w-8 h-8" />}
            title="Rich Interactions"
            description="Hover states, glows, and micro-animations"
          />
        </motion.div>
      </main>

      {/* Bottom Sheet Demo */}
      <BottomSheet
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Bottom Sheet Demo"
      >
        <div className="space-y-4">
          <p className="text-text-primary">
            This is the Silk bottom sheet component with enhanced styling! It features:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li>Smooth drag-to-close interaction with spring physics</li>
            <li>Backdrop blur effect for depth</li>
            <li>Keyboard navigation (try pressing ESC)</li>
            <li>Focus trap for accessibility</li>
            <li>Glass morphism styling</li>
          </ul>
          <div className="pt-4">
            <motion.button
              onClick={() => setSheetOpen(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-teal text-background rounded-2xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function ColorSwatch({ color, name, glow, index }: { color: string; name: string; glow?: boolean; index: number }) {
  return (
    <motion.div
      className="space-y-2 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative">
        {glow && (
          <div
            className="absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300"
            style={{ backgroundColor: color }}
          />
        )}
        <div
          className="relative h-20 rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/30"
          style={{ backgroundColor: color }}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs font-mono text-text-secondary">{color}</p>
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.button
      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-150 ${
        active
          ? 'text-accent-cyan bg-accent-cyan/10 shadow-glow-cyan'
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="relative group"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-accent-teal to-accent-cyan rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative bg-surface rounded-2xl p-6 border border-white/5 h-full">
        <div className="text-accent-teal mb-3">{icon}</div>
        <h4 className="text-text-primary font-semibold mb-2">{title}</h4>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
