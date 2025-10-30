const Submit = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Submission</h1>
      <p className="text-muted-foreground">
        Links for judges and organizers.
      </p>
      <div className="space-y-3">
        <a className="underline" href="https://ai-league-pilot.vercel.app/" target="_blank" rel="noreferrer">
          Demo
        </a>
        <div>
          <span className="text-sm text-muted-foreground">Video (Loom 1 min): </span>
          <span className="text-sm">TBD</span>
        </div>
        <a className="underline" href="https://github.com/Diyarsh/ai-league-pilot" target="_blank" rel="noreferrer">
          GitHub / README
        </a>
      </div>
      <div className="text-sm text-muted-foreground">
        Tracks: Consumer Apps • DeFi • Undefined
      </div>
    </div>
  );
};

export default Submit;


