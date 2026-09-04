import { skills } from "@/data/skills";

export function Skills() {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <section id="skills" className="section">
      <div className="container max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-white">
          Technical Arsenal
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="card p-8">
              <h3 className="text-lg font-semibold text-white mb-6 font-mono">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-sm font-medium hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
