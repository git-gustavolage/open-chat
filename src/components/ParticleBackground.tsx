import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 4 + 4,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-neutral-100">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="bg-black"
          style={{
            position: "absolute",
            borderRadius: "100%",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `twinkle ${particle.duration}s ease-in-out infinite, float ${particle.duration + 2}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            zIndex: "10"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;