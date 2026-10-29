const members = [
  { number:"01", name:"Harpreet Singh Devgun", role:"Founder", focus:"Investment Architect · Real Estate Strategist", imageClass:"harpreet" },
  { number:"02", name:"Ashok Kumar Singh", role:"Partner / Sales Expert", focus:"Real Estate · Sales", imageClass:"ashok" },
];

export function TeamSection() {
  return <section className="sec team-section" id="leadership">
    <div className="team-orbit" aria-hidden="true"/>
    <div className="wrap team-inner">
      <header className="team-heading reveal">
        <div><div className="eyebrow">Leadership</div><h2 className="h2">The people behind<br/><span>the perspective.</span></h2></div>
        <p>Vesterra is led through experience, personal attention and a shared commitment to building enduring value.</p>
      </header>
      <div className="team-swipe-note">Swipe to meet the team <b>→</b></div>
      <div className="team-grid">
        {members.map(member=><article className="team-card reveal" key={member.name}>
          <div className={`team-photo ${member.imageClass}`} role="img" aria-label={`${member.name}, ${member.role}`}><span>{member.number}</span></div>
          <div className="team-copy"><div className="team-role">{member.role}</div><h3>{member.name}</h3><p>{member.focus}</p><i aria-hidden="true"/></div>
        </article>)}
      </div>
    </div>
  </section>;
}
