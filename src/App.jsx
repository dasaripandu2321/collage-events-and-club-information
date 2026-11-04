import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Bot, Users, Calendar, Database, Search, Send, X, ChevronDown, ChevronUp,
  FileText, MapPin, Clock, CheckCircle2, Sparkles, Cpu, Camera, TrendingUp,
  Leaf, Layers, Zap, Info, Bell, RefreshCw, Ticket, Mail, GraduationCap,
  Activity, Hash, Code, Music, Globe, Trophy, Shield, Rocket, Briefcase, Gamepad2, Mic,
} from "lucide-react";

/* =====================================================================
   1. EMBEDDED KNOWLEDGE BASE (pre-chunked documents)
   ===================================================================== */

const KB_DOCS = [
  {
    id: "club-robotics", type: "club", title: "Robotics & AI Club Handbook",
    file: "clubs/robotics_ai_handbook.pdf", pages: 6,
    chunks: [
      {
        text: "The Robotics & AI Club meets every Tuesday and Thursday at 6:00 PM in the Innovation Lab (Engineering Block, Room 204). Recruitment status: OPEN for the Autumn 2026 intake. Members build autonomous robots, train machine learning models and compete in inter-college tournaments. No prior experience is required.",
        ans: "The Robotics & AI Club meets every Tuesday and Thursday at 6:00 PM in the Innovation Lab (Engineering Block, Room 204). Recruitment is currently OPEN, and no prior experience is required.",
      },
      {
        text: "Robotics & AI Club activities include a weekly build night, a machine learning reading group, and the annual RoboHack 24-hour hackathon. The club lead is Aarav Menon (3rd year, Computer Science). Contact: robotics@campuspulse.edu.",
        ans: "The club runs weekly build nights, an ML reading group and the annual RoboHack hackathon. Its lead is Aarav Menon (robotics@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-webdev", type: "club", title: "Web & Open Source Society Handbook",
    file: "clubs/web_opensource_handbook.pdf", pages: 5,
    chunks: [
      {
        text: "The Web & Open Source Society meets every Wednesday and Saturday at 5:00 PM in the Turing Computing Center, Lab 3. Recruitment status: OPEN for all years. Members build fullstack web applications, contribute to open-source software on GitHub, and conduct developer bootcamps in React, TypeScript, and Node.js.",
        ans: "The Web & Open Source Society meets every Wednesday and Saturday at 5:00 PM in the Turing Computing Center (Lab 3). Recruitment is OPEN, and members build fullstack web applications and contribute to open-source projects.",
      },
      {
        text: "Web & Open Source Society highlights: Git/GitHub workshops, open-source sprints for Hacktoberfest, and client projects for campus organizations. Club lead: Devansh Gupta (3rd year, Information Technology). Contact: dev@campuspulse.edu.",
        ans: "The society organizes Git workshops, open-source sprints, and campus software projects. Its lead is Devansh Gupta (dev@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-cyber", type: "club", title: "Cybersecurity & Ethical Hacking Guide",
    file: "clubs/cybersecurity_club_guide.pdf", pages: 4,
    chunks: [
      {
        text: "The Cybersecurity & Ethical Hacking Club meets every Thursday at 6:30 PM in the Cyber Lab (Tech Tower, Room 401). Recruitment status: OPEN. The club specializes in offensive security, defensive system hardening, cryptography, network vulnerability analysis, and inter-college Capture The Flag (CTF) tournaments.",
        ans: "The Cybersecurity & Ethical Hacking Club meets Thursdays at 6:30 PM in Cyber Lab (Tech Tower 401). Recruitment is OPEN, and activities focus on CTFs, penetration testing, and security hardening.",
      },
      {
        text: "Cybersecurity Club resources: isolated sandbox testbeds, penetration testing tool suites, and weekly security briefings. Club lead: Tanvi Deshmukh (4th year, Computer Science). Contact: cyber@campuspulse.edu.",
        ans: "Members get access to isolated testbeds and penetration testing tool suites. The club lead is Tanvi Deshmukh (cyber@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-game", type: "club", title: "Game Development & VR Guild Handbook",
    file: "clubs/gamedevel_vr_guild.pdf", pages: 4,
    chunks: [
      {
        text: "The Game Development & VR Guild meets every Friday at 5:00 PM in the Media Arts Lab, Studio 102. Recruitment status: OPEN. Members design and program 2D and 3D indie games, experiment with VR headsets, build custom shaders, and participate in global game jams using Unity, Unreal Engine, and Godot.",
        ans: "The Game Development & VR Guild meets Fridays at 5:00 PM in Media Arts Lab Studio 102. Recruitment is OPEN for programmers, artists, and storytellers building games in Unity, Unreal, and Godot.",
      },
      {
        text: "Game Dev Guild perks: high-end GPU workstations, Meta Quest VR testkits, drawing tablets, and asset libraries. Club lead: Neil Fernandes (3rd year, Digital Media & Game Design). Contact: gamedev@campuspulse.edu.",
        ans: "Members have access to GPU workstations, VR headsets, and graphics tablets. The lead is Neil Fernandes (gamedev@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-photo", type: "club", title: "Lens & Light Photography Club Guide",
    file: "clubs/photography_club_guide.pdf", pages: 4,
    chunks: [
      {
        text: "The Lens & Light Photography Club meets every Wednesday at 5:30 PM in the Arts Annex, Studio B. Recruitment status: OPEN. Members get access to the shared darkroom, studio lighting and a camera lending library with 12 DSLR and mirrorless bodies.",
        ans: "The Photography Club meets every Wednesday at 5:30 PM in the Arts Annex, Studio B. Recruitment is OPEN, and members can borrow cameras from the lending library and use the darkroom.",
      },
      {
        text: "Photography Club highlights: monthly photo walks, a semester exhibition at the Campus Art Gallery, and portrait workshops. Beginners are welcome; bring any camera or a smartphone. Club lead: Meera Iyer (2nd year, Design).",
        ans: "Beginners are welcome (a smartphone is fine). The club hosts monthly photo walks, portrait workshops and a semester exhibition. The lead is Meera Iyer.",
      },
    ],
  },
  {
    id: "club-music", type: "club", title: "Campus Beats & Harmony Music Club Charter",
    file: "clubs/music_club_charter.pdf", pages: 5,
    chunks: [
      {
        text: "Campus Beats & Harmony (Music Club) meets Tuesdays and Fridays at 5:30 PM in the Music Hall, Performing Arts Center. Recruitment status: OPEN for vocalists, instrumentalists (guitar, drums, keyboards, violin, bass), audio engineers, and songwriters.",
        ans: "The Music Club (Campus Beats & Harmony) meets Tuesdays and Fridays at 5:30 PM in the Music Hall (Performing Arts Center). Recruitment is OPEN for vocalists, instrumentalists, and sound engineers.",
      },
      {
        text: "Music Club activities include acoustic courtyard sessions, recording studio time, the annual Battle of the Bands, and inter-college cultural fest performances. Club lead: Sahana Krishnan (2nd year, Architecture). Contact: music@campuspulse.edu.",
        ans: "Activities include weekly acoustic jams, studio recording, and Battle of the Bands. The lead is Sahana Krishnan (music@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-drama", type: "club", title: "Thespians Drama & Theatre Society Handbook",
    file: "clubs/thespians_theatre_handbook.pdf", pages: 4,
    chunks: [
      {
        text: "The Thespians Drama & Theatre Society meets Mondays and Thursdays at 6:00 PM in the Open Amphitheatre and Old Auditorium. Recruitment status: CLOSED for the current term as casting for the annual play is finalized. Waitlist is open for crew and upcoming spring auditions.",
        ans: "The Thespians Theatre Society meets Mondays and Thursdays at 6:00 PM in the Amphitheatre. Recruitment is currently CLOSED for actors, but waitlist requests are accepted for production crew and spring auditions.",
      },
      {
        text: "Thespians society focuses on stage acting, street play (Nukkad Natak), scriptwriting, lighting, and sound direction. Club lead: Kabir Sen (3rd year, English Literature). Contact: theatre@campuspulse.edu.",
        ans: "The society produces stage plays, street theatre, and script workshops. The lead is Kabir Sen (theatre@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-finance", type: "club", title: "Finance & Investment Society Charter",
    file: "clubs/finance_society_charter.pdf", pages: 5,
    chunks: [
      {
        text: "The Finance & Investment Society meets every Monday at 4:00 PM in the Business School, Seminar Hall 3. Recruitment status: CLOSED. The society has reached its capacity of 60 members this term; students may join the waitlist, and the next intake opens in January 2027.",
        ans: "The Finance & Investment Society meets every Monday at 4:00 PM in Business School Seminar Hall 3. Recruitment is currently CLOSED (capacity reached), but you can join the waitlist; the next intake opens in January 2027.",
      },
      {
        text: "Finance Society activities: a student-managed mock portfolio, weekly market briefings, equity research competitions and guest talks from alumni in banking and fintech. Club lead: Rohan Kapoor (4th year, Economics).",
        ans: "The society runs a student-managed mock portfolio, weekly market briefings, equity research contests and alumni talks. Its lead is Rohan Kapoor.",
      },
    ],
  },
  {
    id: "club-ecell", type: "club", title: "E-Cell (Entrepreneurship & Startup Cell) Charter",
    file: "clubs/ecell_startup_charter.pdf", pages: 6,
    chunks: [
      {
        text: "The Entrepreneurship & Startup Cell (E-Cell) meets Wednesdays at 4:30 PM in the Incubation Center, Room 101. Recruitment status: OPEN. E-Cell nurtures student ventures through founder mentorship, investor networking, pitch decks preparation, and pre-seed incubation grants.",
        ans: "E-Cell meets Wednesdays at 4:30 PM in Incubation Center Room 101. Recruitment is OPEN for students passionate about startups, venture capital, and building products.",
      },
      {
        text: "E-Cell flagship initiatives include Campus Shark Tank, startup hack nights, angel investor demo days, and founder fireside chats. Club lead: Priya Sharma (4th year, Management Studies). Contact: ecell@campuspulse.edu.",
        ans: "Flagship programs include Campus Shark Tank, founder talks, and seed grant mentorship. The club lead is Priya Sharma (ecell@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-consulting", type: "club", title: "Consulting & Strategy Club Guide",
    file: "clubs/consulting_club_guide.pdf", pages: 4,
    chunks: [
      {
        text: "The Consulting & Strategy Club meets Thursdays at 5:00 PM in the Management Block, Case Study Room B. Recruitment status: CLOSED (term cohort full at 45 members). Waitlist is open for the January 2027 recruitment cycle.",
        ans: "The Consulting & Strategy Club meets Thursdays at 5:00 PM in Management Block Case Study Room B. Recruitment is currently CLOSED, but waitlist applications are open for the January 2027 cohort.",
      },
      {
        text: "Consulting Club members prepare for management consulting case interviews (MBB), practice market sizing, crack business strategy cases, and compete in national case competitions. Club lead: Aditya Verma (3rd year, Economics). Contact: consulting@campuspulse.edu.",
        ans: "Members practice management consulting case frameworks, market sizing, and mock interviews. The lead is Aditya Verma (consulting@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-eco", type: "club", title: "Sustainability Collective Overview",
    file: "clubs/sustainability_collective.pdf", pages: 5,
    chunks: [
      {
        text: "The Sustainability Collective meets every Friday at 3:30 PM at the Green Hub, next to the Central Lawn. Recruitment status: OPEN all year. Volunteers run campus recycling drives, the community garden, composting and energy-audit projects.",
        ans: "The Sustainability Collective meets every Friday at 3:30 PM at the Green Hub beside the Central Lawn. Recruitment is OPEN all year for recycling, garden, composting and energy-audit projects.",
      },
      {
        text: "The Sustainability Collective organises the annual Eco Fair, tree-planting weekends and a green-campus scorecard. Club lead: Ananya Rao (3rd year, Environmental Science). Contact: green@campuspulse.edu.",
        ans: "The collective organises the Eco Fair, tree-planting weekends and a green-campus scorecard. Its lead is Ananya Rao (green@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-cleanenergy", type: "club", title: "Clean Energy & EV Society Charter",
    file: "clubs/clean_energy_ev_charter.pdf", pages: 4,
    chunks: [
      {
        text: "The Clean Energy & EV Society meets Tuesdays at 4:00 PM in the Renewable Energy Tech Center. Recruitment status: OPEN. Members conduct research on electric vehicle powertrains, solar charging stations, lithium battery recycling, and campus microgrids.",
        ans: "The Clean Energy & EV Society meets Tuesdays at 4:00 PM in the Renewable Energy Tech Center. Recruitment is OPEN, focusing on electric vehicles, solar power, and campus clean tech.",
      },
      {
        text: "The Clean Energy Society collaborates with the Sustainability Collective on campus solar rooftop monitoring and building an EV prototype kart. Club lead: Farhan Qureshi (3rd year, Electrical Engineering). Contact: cleanenergy@campuspulse.edu.",
        ans: "The society works on solar energy monitoring and student EV kart prototyping. The lead is Farhan Qureshi (cleanenergy@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-mun", type: "club", title: "Model United Nations & Debate Society Guide",
    file: "clubs/mun_debate_society.pdf", pages: 5,
    chunks: [
      {
        text: "The Model United Nations & Debate Society meets Wednesdays at 6:00 PM in the Law & Humanities Seminar Hall. Recruitment status: OPEN. The society trains delegates in parliamentary debating, multilateral diplomacy, policy resolution drafting, and geopolitical conflict negotiation.",
        ans: "The MUN & Debate Society meets Wednesdays at 6:00 PM in the Law & Humanities Seminar Hall. Recruitment is OPEN for students interested in public speaking, parliamentary debate, and diplomacy.",
      },
      {
        text: "The society hosts the annual PulseMUN conference, inter-college mock parliaments, and sends fully sponsored delegations to national collegiate MUNs. Club lead: Ishaan Malhotra (3rd year, Political Science). Contact: mun@campuspulse.edu.",
        ans: "The society organizes the annual PulseMUN conference and parliamentary debate tournaments. The lead is Ishaan Malhotra (mun@campuspulse.edu).",
      },
    ],
  },
  {
    id: "club-sports", type: "club", title: "Campus Sports & Athletics League Handbook",
    file: "clubs/sports_athletics_handbook.pdf", pages: 5,
    chunks: [
      {
        text: "The Campus Sports & Athletics League meets Mondays, Wednesdays, and Fridays with morning sessions at 6:30 AM and evening training at 5:00 PM at the University Sports Complex & Running Track. Recruitment status: OPEN for both recreational and competitive athletes.",
        ans: "The Campus Sports League meets Mon, Wed, and Fri (6:30 AM & 5:00 PM) at the University Sports Complex. Recruitment is OPEN for intramural leagues, athletics, badminton, and fitness.",
      },
      {
        text: "The Sports League organizes intra-college tournaments in badminton, football, basketball, and table tennis, as well as the annual 5K campus charity marathon. Club lead: Ritu Patel (4th year, Physical Education). Contact: sports@campuspulse.edu.",
        ans: "The league organizes badminton, football, basketball tournaments, and campus fitness marathons. The lead is Ritu Patel (sports@campuspulse.edu).",
      },
    ],
  },
  {
    id: "event-robohack", type: "event", title: "Event Brief: RoboHack 2026",
    file: "events/robohack_2026_brief.pdf", pages: 3,
    chunks: [
      {
        text: "RoboHack 2026 is a 24-hour AI and robotics hackathon on Saturday, November 7, 2026, starting 9:00 AM at the Innovation Lab, Engineering Block. Teams of 2 to 4 students build a working prototype. Registration (RSVP) is free; 80 seats are available. Prizes total INR 75,000.",
        ans: "RoboHack 2026 is a 24-hour AI and robotics hackathon on Saturday, November 7, 2026 at 9:00 AM in the Innovation Lab (Engineering Block). Teams of 2 to 4 compete for INR 75,000 in prizes, and RSVP is free.",
      },
      {
        text: "RoboHack 2026 RSVP link: campuspulse.edu/rsvp/robohack-2026. Food and refreshments are provided. Bring a laptop and charger. Mentors from the Robotics & AI Club and industry partners will be on site.",
        ans: "RSVP at campuspulse.edu/rsvp/robohack-2026. Food is provided; bring a laptop and charger. Mentors will be on site.",
      },
    ],
  },
  {
    id: "event-photowalk", type: "event", title: "Event Brief: Golden Hour Photo Walk & Exhibition",
    file: "events/golden_hour_walk_brief.pdf", pages: 2,
    chunks: [
      {
        text: "The Golden Hour Photo Walk & Exhibition takes place on Saturday, November 14, 2026 at 4:30 PM. The walk starts at the Main Quadrangle and finishes with an exhibition at the Campus Art Gallery. Free entry; 120 seats. RSVP link: campuspulse.edu/rsvp/golden-hour.",
        ans: "The Golden Hour Photo Walk & Exhibition is on Saturday, November 14, 2026 at 4:30 PM, starting at the Main Quadrangle and ending with an exhibition at the Campus Art Gallery. Entry is free; RSVP at campuspulse.edu/rsvp/golden-hour.",
      },
    ],
  },
  {
    id: "event-greenfin", type: "event", title: "Event Brief: Green Finance & Eco Fair",
    file: "events/green_finance_ecofair_brief.pdf", pages: 3,
    chunks: [
      {
        text: "The Green Finance & Eco Fair is on Saturday, November 21, 2026 at 10:00 AM on the Central Lawn. It combines sustainability stalls, a student panel on green investing, and a recycled-product marketplace. Free entry; 200 seats. RSVP link: campuspulse.edu/rsvp/eco-fair.",
        ans: "The Green Finance & Eco Fair runs Saturday, November 21, 2026 at 10:00 AM on the Central Lawn with sustainability stalls, a green investing panel and a recycled-product marketplace. RSVP at campuspulse.edu/rsvp/eco-fair.",
      },
    ],
  },
  {
    id: "event-sharktank", type: "event", title: "Event Brief: Campus Shark Tank 2026",
    file: "events/sharktank_2026_brief.pdf", pages: 3,
    chunks: [
      {
        text: "Campus Shark Tank is on Saturday, November 28, 2026 at 2:00 PM in the Main Auditorium, Management Block. Top 10 shortlisted student startups pitch live in front of angel investors and VC partners. Total seed pool of INR 2,00,000 in equity-free grants. 150 spectator seats; RSVP link: campuspulse.edu/rsvp/sharktank-2026.",
        ans: "Campus Shark Tank takes place on Saturday, November 28, 2026 at 2:00 PM in the Main Auditorium (Management Block). 10 student startups pitch for INR 2,00,000 in seed grants. Free spectator RSVP at campuspulse.edu/rsvp/sharktank-2026.",
      },
    ],
  },
  {
    id: "event-ctf", type: "event", title: "Event Brief: CyberPulse CTF 2026",
    file: "events/cyberpulse_ctf_brief.pdf", pages: 3,
    chunks: [
      {
        text: "CyberPulse 2026 is a 12-hour Capture The Flag (CTF) security competition on Saturday, December 5, 2026 starting at 8:00 AM in the Cyber Lab (Tech Tower 401). Categories include Web Exploitation, Reverse Engineering, Cryptography, and Forensics. 100 seats available. RSVP link: campuspulse.edu/rsvp/cyberpulse-ctf.",
        ans: "CyberPulse CTF is on Saturday, December 5, 2026 at 8:00 AM in the Cyber Lab (Tech Tower 401). A 12-hour challenge covering web security, crypto, and forensics with 100 seats. RSVP at campuspulse.edu/rsvp/cyberpulse-ctf.",
      },
    ],
  },
  {
    id: "event-battlebands", type: "event", title: "Event Brief: Echoes Acoustic Night & Battle of the Bands",
    file: "events/echoes_bands_brief.pdf", pages: 3,
    chunks: [
      {
        text: "Echoes: Winter Acoustic Night & Battle of the Bands is on Saturday, December 12, 2026 at 6:00 PM in the Open Air Amphitheatre. Featuring 8 collegiate bands, live food trucks, and acoustic jams under the winter stars. Free entry; 250 seats. RSVP link: campuspulse.edu/rsvp/echoes-bands.",
        ans: "Echoes Acoustic Night & Battle of the Bands takes place Saturday, December 12, 2026 at 6:00 PM in the Open Air Amphitheatre with 8 bands, food trucks, and 250 seats. RSVP at campuspulse.edu/rsvp/echoes-bands.",
      },
    ],
  },
  {
    id: "event-mun", type: "event", title: "Event Brief: PulseMUN Diplomacy Summit 2026",
    file: "events/pulsemun_2026_brief.pdf", pages: 3,
    chunks: [
      {
        text: "PulseMUN 2026 Diplomacy Summit takes place on Friday, December 18, 2026 at 9:30 AM in the Law & Humanities Seminar Hall. Simulating UN General Assembly and Security Council debates on sustainable development and international security. 110 delegate seats; RSVP link: campuspulse.edu/rsvp/pulsemun-2026.",
        ans: "PulseMUN 2026 Diplomacy Summit is on Friday, December 18, 2026 at 9:30 AM in the Law & Humanities Seminar Hall. Simulates UN committees with 110 delegate seats; RSVP at campuspulse.edu/rsvp/pulsemun-2026.",
      },
    ],
  },
  {
    id: "event-marathon", type: "event", title: "Event Brief: Campus Run for Green 5K Marathon",
    file: "events/run_for_green_brief.pdf", pages: 2,
    chunks: [
      {
        text: "The Campus Run for Green 5K Charity Marathon is on Saturday, January 9, 2027 at 6:30 AM starting at the University Sports Complex running towards the Lake Perimeter. For every runner who completes the 5K, 2 native trees will be planted on campus. 300 spots available. RSVP link: campuspulse.edu/rsvp/run-for-green.",
        ans: "The Campus Run for Green 5K Charity Marathon happens Saturday, January 9, 2027 at 6:30 AM at the University Sports Complex. 2 trees are planted per participant; 300 seats available. RSVP at campuspulse.edu/rsvp/run-for-green.",
      },
    ],
  },
  {
    id: "event-gamejam", type: "event", title: "Event Brief: PixelCraft Indie Game Jam & VR Expo",
    file: "events/pixelcraft_gamejam_brief.pdf", pages: 3,
    chunks: [
      {
        text: "PixelCraft is a 36-hour Indie Game Jam and VR Expo taking place on Saturday, January 16, 2027 starting at 10:00 AM in the Media Arts Lab & Innovation Hub. Teams create 2D, 3D, or VR games around a mystery theme. Includes free pizza, asset pack licenses, and a community arcade playtest. 90 seats. RSVP link: campuspulse.edu/rsvp/pixelcraft-jam.",
        ans: "PixelCraft 36-Hour Game Jam & VR Expo kicks off Saturday, January 16, 2027 at 10:00 AM in the Media Arts Lab. Teams build indie or VR games with 90 seats open. RSVP at campuspulse.edu/rsvp/pixelcraft-jam.",
      },
    ],
  },
  {
    id: "policy-join", type: "policy", title: "Policy 1.1: How to Join a Campus Club",
    file: "policies/joining_clubs_policy.pdf", pages: 2,
    chunks: [
      {
        text: "To join a club: (1) browse the Explore Clubs directory, (2) check the recruitment status is OPEN, (3) submit the membership form with your student email and a short motivation note, (4) attend one trial meeting. Membership is confirmed by the club lead within 3 working days. Students may join up to 3 clubs per semester.",
        ans: "To join a club, check that recruitment is OPEN, submit the membership form with your student email and a short note, then attend a trial meeting. The lead confirms within 3 working days, and you can join up to 3 clubs per semester.",
      },
      {
        text: "Recruitment overview for Autumn 2026: OPEN clubs include Robotics & AI, Web & Open Source, Cybersecurity, Game Development, Photography, Music (Campus Beats), E-Cell, Clean Energy, Model UN & Debate, and Sports & Athletics League. CLOSED clubs accepting waitlist only: Finance & Investment Society, Consulting & Strategy Club, and Thespians Drama Society.",
        ans: "Clubs currently recruiting (OPEN): Robotics & AI, Web & Open Source, Cybersecurity, Game Dev, Photography, Music, E-Cell, Clean Energy, Model UN & Debate, and Sports League. Closed clubs accepting waitlist: Finance Society, Consulting & Strategy, and Thespians Theatre.",
      },
    ],
  },
  {
    id: "policy-newclub", type: "policy", title: "Policy 2.4: Starting a New Club",
    file: "policies/new_club_policy.pdf", pages: 3,
    chunks: [
      {
        text: "To start a new club you need: a minimum of 15 founding members, a faculty advisor, a one-page charter with goals and a semester plan, and a proposed budget. Submit the proposal to the Student Affairs Office. The Student Council reviews proposals on the first Monday of each month.",
        ans: "To start a new club you need at least 15 founding members, a faculty advisor, a one-page charter with a semester plan and a proposed budget. Submit it to the Student Affairs Office; the Student Council reviews proposals on the first Monday of every month.",
      },
      {
        text: "New clubs operate on a probation period of one semester. They receive a starter grant of INR 10,000 and a locker in the Student Activity Center once approved. Clubs must host at least two public events per semester to be renewed.",
        ans: "Approved clubs spend one semester on probation, receive a INR 10,000 starter grant and a locker, and must host at least two public events per semester to be renewed.",
      },
    ],
  },
  {
    id: "policy-venue", type: "policy", title: "Policy 3.2: Venue Booking Rules",
    file: "policies/venue_booking_rules.pdf", pages: 4,
    chunks: [
      {
        text: "Venue bookings must be requested at least 7 days in advance through the Student Activity Center portal. Clubs may reserve a venue for a maximum of 4 hours per booking. Auditorium and Central Lawn bookings for events above 100 attendees require approval from the Dean of Students.",
        ans: "Venues must be booked at least 7 days ahead via the Student Activity Center portal, for up to 4 hours per booking. Events above 100 attendees at the Auditorium or Central Lawn need Dean of Students approval.",
      },
      {
        text: "Venue booking conditions: amplified sound must stop by 9:00 PM, food stalls need a hygiene permit, and the booking club is responsible for cleanup. Cancellations less than 48 hours before the event may reduce a club's booking priority next term.",
        ans: "Amplified sound must stop by 9:00 PM, food stalls need a hygiene permit, and clubs must clean up. Cancelling less than 48 hours ahead can reduce your booking priority next term.",
      },
    ],
  },
];

const CLUBS = [
  {
    id: "club-robotics", name: "Robotics & AI Club", category: "Tech", status: "Open",
    meeting: "Tue & Thu, 6:00 PM", location: "Innovation Lab, Engineering Block 204",
    members: 48, lead: "Aarav Menon", icon: Cpu,
    grad: "from-indigo-500 to-violet-500", chip: "bg-indigo-50 text-indigo-700",
    desc: "Build autonomous robots, train ML models and compete in inter-college tournaments. Beginners welcome.",
  },
  {
    id: "club-webdev", name: "Web & Open Source Society", category: "Tech", status: "Open",
    meeting: "Wed & Sat, 5:00 PM", location: "Turing Computing Center, Lab 3",
    members: 56, lead: "Devansh Gupta", icon: Code,
    grad: "from-blue-600 to-cyan-500", chip: "bg-blue-50 text-blue-700",
    desc: "Build fullstack web applications, contribute to open source on GitHub, and organize developer hackathons.",
  },
  {
    id: "club-cyber", name: "Cybersecurity & Ethical Hacking", category: "Tech", status: "Open",
    meeting: "Thursdays, 6:30 PM", location: "Cyber Lab, Tech Tower 401",
    members: 39, lead: "Tanvi Deshmukh", icon: Shield,
    grad: "from-slate-700 to-zinc-900", chip: "bg-slate-100 text-slate-800",
    desc: "Offensive security, capture-the-flag (CTF) challenges, system defense, and cryptography workshops.",
  },
  {
    id: "club-game", name: "Game Development & VR Guild", category: "Tech", status: "Open",
    meeting: "Fridays, 5:00 PM", location: "Media Arts Lab, Studio 102",
    members: 42, lead: "Neil Fernandes", icon: Gamepad2,
    grad: "from-fuchsia-600 to-pink-500", chip: "bg-fuchsia-50 text-fuchsia-700",
    desc: "Design 2D/3D indie games, shaders, and immersive virtual reality experiences using Unity, Unreal, and Godot.",
  },
  {
    id: "club-photo", name: "Lens & Light Photography", category: "Arts", status: "Open",
    meeting: "Wednesdays, 5:30 PM", location: "Arts Annex, Studio B",
    members: 35, lead: "Meera Iyer", icon: Camera,
    grad: "from-rose-500 to-orange-400", chip: "bg-rose-50 text-rose-700",
    desc: "Photo walks, portrait workshops, a shared darkroom and a camera lending library.",
  },
  {
    id: "club-music", name: "Campus Beats & Harmony (Music)", category: "Arts", status: "Open",
    meeting: "Tue & Fri, 5:30 PM", location: "Music Hall, Performing Arts Center",
    members: 52, lead: "Sahana Krishnan", icon: Music,
    grad: "from-purple-600 to-indigo-600", chip: "bg-purple-50 text-purple-700",
    desc: "Vocalists, bands, instrumentalists, studio recording jams, and live performances across campus fests.",
  },
  {
    id: "club-drama", name: "Thespians Drama & Theatre Society", category: "Arts", status: "Closed",
    meeting: "Mon & Thu, 6:00 PM", location: "Amphitheatre / Old Auditorium",
    members: 38, lead: "Kabir Sen", icon: Mic,
    grad: "from-amber-600 to-red-500", chip: "bg-amber-50 text-amber-700",
    desc: "Stage acting, scriptwriting, street play (Nukkad Natak), set design, and annual theatrical productions.",
  },
  {
    id: "club-finance", name: "Finance & Investment Society", category: "Finance", status: "Closed",
    meeting: "Mondays, 4:00 PM", location: "Business School, Seminar Hall 3",
    members: 60, lead: "Rohan Kapoor", icon: TrendingUp,
    grad: "from-sky-500 to-cyan-500", chip: "bg-sky-50 text-sky-700",
    desc: "Student-run mock portfolio, market briefings and equity research competitions. Waitlist open.",
  },
  {
    id: "club-ecell", name: "E-Cell (Entrepreneurship Cell)", category: "Finance", status: "Open",
    meeting: "Wednesdays, 4:30 PM", location: "Incubation Center, Room 101",
    members: 64, lead: "Priya Sharma", icon: Rocket,
    grad: "from-orange-500 to-amber-500", chip: "bg-orange-50 text-orange-700",
    desc: "Startup pitch events, founder mentorship, pre-seed incubation grants, and angel investor demo days.",
  },
  {
    id: "club-consulting", name: "Consulting & Strategy Club", category: "Finance", status: "Closed",
    meeting: "Thursdays, 5:00 PM", location: "Management Block, Case Room B",
    members: 45, lead: "Aditya Verma", icon: Briefcase,
    grad: "from-teal-600 to-cyan-600", chip: "bg-teal-50 text-teal-700",
    desc: "Cracking business cases, management consulting frameworks, market sizing, and mock interviews.",
  },
  {
    id: "club-eco", name: "Sustainability Collective", category: "Eco", status: "Open",
    meeting: "Fridays, 3:30 PM", location: "Green Hub, Central Lawn",
    members: 41, lead: "Ananya Rao", icon: Leaf,
    grad: "from-emerald-500 to-teal-500", chip: "bg-emerald-50 text-emerald-700",
    desc: "Recycling drives, community garden, composting and campus energy-audit projects.",
  },
  {
    id: "club-cleanenergy", name: "Clean Energy & EV Society", category: "Eco", status: "Open",
    meeting: "Tuesdays, 4:00 PM", location: "Renewable Energy Tech Center",
    members: 34, lead: "Farhan Qureshi", icon: Zap,
    grad: "from-green-600 to-emerald-400", chip: "bg-emerald-50 text-emerald-800",
    desc: "Hands-on projects with electric vehicles, solar rooftop monitoring, and campus green tech prototypes.",
  },
  {
    id: "club-mun", name: "Model UN & Debate Society", category: "Cultural", status: "Open",
    meeting: "Wednesdays, 6:00 PM", location: "Law & Humanities Seminar Hall",
    members: 50, lead: "Ishaan Malhotra", icon: Globe,
    grad: "from-blue-700 to-indigo-800", chip: "bg-indigo-50 text-indigo-800",
    desc: "Parliamentary debate, geopolitical simulations, public speaking, and national collegiate delegations.",
  },
  {
    id: "club-sports", name: "Campus Sports & Athletics League", category: "Sports", status: "Open",
    meeting: "Mon, Wed & Fri (6:30 AM / 5:00 PM)", location: "University Sports Complex",
    members: 72, lead: "Ritu Patel", icon: Trophy,
    grad: "from-rose-600 to-red-600", chip: "bg-rose-50 text-rose-700",
    desc: "Badminton, basketball, football leagues, track & field training, and the annual 5K campus marathon.",
  },
];

const EVENTS = [
  {
    id: "event-robohack", title: "RoboHack 2026: 24-Hour AI Hackathon", tags: ["Tech"],
    month: "NOV", day: "07", dateLabel: "Sat, Nov 7, 2026", time: "9:00 AM", venue: "Innovation Lab, Engineering Block",
    seats: 80, host: "Robotics & AI Club", rsvp: "campuspulse.edu/rsvp/robohack-2026",
    grad: "from-indigo-600 to-violet-600",
    desc: "Build a working AI or robotics prototype in 24 hours. Teams of 2 to 4, mentors on site, food provided, INR 75,000 in prizes.",
    agenda: ["9:00 AM: Check-in & team formation", "10:30 AM: Kickoff and challenge reveal", "Noon (next day): Final demos & judging"],
  },
  {
    id: "event-photowalk", title: "Golden Hour Photo Walk & Exhibition", tags: ["Arts"],
    month: "NOV", day: "14", dateLabel: "Sat, Nov 14, 2026", time: "4:30 PM", venue: "Main Quadrangle → Campus Art Gallery",
    seats: 120, host: "Lens & Light Photography", rsvp: "campuspulse.edu/rsvp/golden-hour",
    grad: "from-rose-500 to-orange-400",
    desc: "Capture campus at golden hour on a guided walk, then see curated student work at the gallery exhibition.",
    agenda: ["4:30 PM: Walk begins at the Main Quadrangle", "5:45 PM: Sunset shooting session", "6:30 PM: Exhibition opening"],
  },
  {
    id: "event-greenfin", title: "Green Finance & Eco Fair", tags: ["Eco", "Finance"],
    month: "NOV", day: "21", dateLabel: "Sat, Nov 21, 2026", time: "10:00 AM", venue: "Central Lawn",
    seats: 200, host: "Sustainability Collective & Finance Society", rsvp: "campuspulse.edu/rsvp/eco-fair",
    grad: "from-emerald-500 to-sky-500",
    desc: "Sustainability stalls, a student panel on green investing and a recycled-product marketplace.",
    agenda: ["10:00 AM: Fair opens", "12:00 PM: Green investing panel", "2:30 PM: Marketplace & prize draw"],
  },
  {
    id: "event-sharktank", title: "Campus Shark Tank: Student Pitch Day", tags: ["Finance"],
    month: "NOV", day: "28", dateLabel: "Sat, Nov 28, 2026", time: "2:00 PM", venue: "Main Auditorium, Management Block",
    seats: 150, host: "E-Cell (Entrepreneurship Cell)", rsvp: "campuspulse.edu/rsvp/sharktank-2026",
    grad: "from-amber-500 to-orange-500",
    desc: "Top 10 student startups pitch live before angel investors and venture capitalists for equity-free seed grants up to INR 2,00,000.",
    agenda: ["2:00 PM: Keynote address by VC Partner", "2:45 PM: 10 Startup Pitches & Product Demos", "5:00 PM: Judges Q&A and Seed Grant Awards"],
  },
  {
    id: "event-ctf", title: "CyberPulse: 12-Hour CTF Defense Challenge", tags: ["Tech"],
    month: "DEC", day: "05", dateLabel: "Sat, Dec 5, 2026", time: "8:00 AM", venue: "Cyber Lab, Tech Tower 401",
    seats: 100, host: "Cybersecurity & Ethical Hacking Club", rsvp: "campuspulse.edu/rsvp/cyberpulse-ctf",
    grad: "from-cyan-600 to-blue-600",
    desc: "Test your cybersecurity skills in web exploitation, binary reversing, cryptography, and digital forensics. Prizes and tech internships up for grabs.",
    agenda: ["8:00 AM: System check & scoreboard access", "8:30 AM: Challenges go live", "7:30 PM: Solution walkthroughs & prize ceremony"],
  },
  {
    id: "event-battlebands", title: "Echoes: Winter Acoustic Night & Battle of Bands", tags: ["Arts", "Cultural"],
    month: "DEC", day: "12", dateLabel: "Sat, Dec 12, 2026", time: "6:00 PM", venue: "Open Air Amphitheatre",
    seats: 250, host: "Campus Beats & Harmony (Music Club)", rsvp: "campuspulse.edu/rsvp/echoes-bands",
    grad: "from-purple-600 to-pink-500",
    desc: "Experience electrifying acoustic sets, rock ballads, and vocal showdowns under the winter night sky with live student food stalls.",
    agenda: ["6:00 PM: Amphitheatre gates open", "6:30 PM: 8-Band Battle & Acoustic Jam", "9:00 PM: Headliner performance & Fan Choice Award"],
  },
  {
    id: "event-mun", title: "PulseMUN 2026: Youth Diplomacy Summit", tags: ["Cultural"],
    month: "DEC", day: "18", dateLabel: "Fri, Dec 18, 2026", time: "9:30 AM", venue: "Law & Humanities Seminar Hall",
    seats: 110, host: "Model UN & Debate Society", rsvp: "campuspulse.edu/rsvp/pulsemun-2026",
    grad: "from-blue-600 to-indigo-700",
    desc: "Debate pressing global challenges, geopolitical crises, and draft consensus resolutions in simulated UN General Assembly and Security Council committees.",
    agenda: ["9:30 AM: Opening Plenary & Keynote", "11:00 AM: Committee Sessions & Moderated Caucuses", "4:30 PM: Resolution Voting & Best Delegate Awards"],
  },
  {
    id: "event-marathon", title: "Campus Run for Green: 5K Charity Marathon", tags: ["Sports", "Eco"],
    month: "JAN", day: "09", dateLabel: "Sat, Jan 9, 2027", time: "6:30 AM", venue: "University Sports Complex → Lake Perimeter",
    seats: 300, host: "Campus Sports League & Sustainability Collective", rsvp: "campuspulse.edu/rsvp/run-for-green",
    grad: "from-emerald-600 to-teal-600",
    desc: "Kick off the new semester with a scenic 5K morning run around the campus lake. 2 native trees will be planted on campus for every completed run.",
    agenda: ["6:30 AM: Bib pickup & warmup stretch", "7:00 AM: 5K Run flag-off", "8:15 AM: Finish line breakfast & tree-planting drive"],
  },
  {
    id: "event-gamejam", title: "PixelCraft: 36-Hour Indie Game Jam & VR Expo", tags: ["Tech", "Arts"],
    month: "JAN", day: "16", dateLabel: "Sat, Jan 16, 2027", time: "10:00 AM", venue: "Media Arts Lab & Innovation Hub",
    seats: 90, host: "Game Development & VR Guild", rsvp: "campuspulse.edu/rsvp/pixelcraft-jam",
    grad: "from-fuchsia-600 to-rose-600",
    desc: "Build a playable 2D, 3D, or VR game prototype around a secret theme in 36 hours. Free meals, mentor help, and community playtesting arcade.",
    agenda: ["10:00 AM: Secret theme reveal & engine workshops", "11:30 AM: 36-hour sprint begins", "Sun 4:00 PM: Public arcade showcase & judging"],
  },
];

/* =====================================================================
   2. MOCK VECTOR ENGINE (TF-IDF + cosine similarity, synonym-expanded)
   ===================================================================== */

const STOP = new Set("a an the is are was were be to of in on at for and or do does how what when where which who can i me my we you your it this that with about from by as there any tell please should would could much many get".split(" "));
const SYN = {
  join: ["join", "membership", "member", "apply", "enrol"],
  robot: ["robotics", "ai", "hackathon"], robots: ["robotics", "ai"], hackathon: ["robohack", "robotics", "hackathon"],
  photo: ["photography", "camera"], photos: ["photography"], camera: ["photography"],
  invest: ["finance", "investment"], stock: ["finance", "investment"], stocks: ["finance"], money: ["finance"],
  green: ["sustainability", "eco"], environment: ["sustainability", "eco"], recycle: ["sustainability", "recycling"],
  start: ["start", "new", "club", "proposal"], create: ["start", "new", "club", "proposal"], found: ["start", "new", "club"],
  book: ["booking", "venue"], reserve: ["booking", "venue"], hall: ["venue"], room: ["venue"],
  recruiting: ["recruitment", "open", "status"], recruit: ["recruitment", "open"], recruiting_: ["recruitment"],
  open: ["open", "recruitment"], closed: ["closed", "recruitment", "waitlist"],
  events: ["event", "rsvp"], event: ["event", "rsvp"], upcoming: ["event", "rsvp"], happening: ["event"],
  meet: ["meets", "meeting"], meeting: ["meets"], schedule: ["meets", "time"], time: ["meets"],
  code: ["coding", "web", "developer", "opensource", "software"], coding: ["code", "developer", "web"],
  cyber: ["cybersecurity", "security", "hacking", "ctf"], hacking: ["cybersecurity", "ctf"], security: ["cybersecurity"],
  game: ["games", "gaming", "unity", "unreal", "vr"], vr: ["game", "virtual", "gaming"],
  music: ["band", "acoustic", "singing", "beats", "harmony"], song: ["music", "band"], band: ["music", "concert", "echoes"],
  drama: ["theatre", "acting", "thespians", "play"], theater: ["theatre", "drama"], acting: ["drama", "thespians"],
  startup: ["entrepreneurship", "ecell", "business", "pitch", "shark"], venture: ["startup", "ecell", "pitch"], pitch: ["sharktank", "startup", "ecell"],
  consulting: ["strategy", "case", "consultant"],
  sports: ["athletics", "marathon", "fitness", "run"], run: ["marathon", "running", "sports"], marathon: ["run", "sports"],
  debate: ["mun", "diplomacy", "speaking", "united nations"], mun: ["debate", "diplomacy"],
};

const stem = (w) => (w.length > 4 ? w.replace(/(ing|es|s)$/, "") : w);
const tokenize = (text) => {
  const base = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));
  const out = [];
  base.forEach((w) => {
    out.push(stem(w));
    (SYN[w] || []).forEach((s) => out.push(stem(s)));
  });
  return out;
};
const tf = (tokens) => {
  const m = new Map();
  tokens.forEach((t) => m.set(t, (m.get(t) || 0) + 1));
  return m;
};

const ALL_CHUNKS = KB_DOCS.flatMap((doc) =>
  doc.chunks.map((c, i) => ({
    id: `${doc.id}#c${i + 1}`, docId: doc.id, doc, text: c.text, ans: c.ans, index: i + 1,
    tokens: tokenize(`${doc.title} ${c.text}`),
  }))
);
const IDF = (() => {
  const df = new Map();
  ALL_CHUNKS.forEach((c) => new Set(c.tokens).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
  const N = ALL_CHUNKS.length;
  const idf = new Map();
  df.forEach((v, t) => idf.set(t, Math.log(1 + N / v)));
  return idf;
})();
const vec = (tokens) => {
  const v = new Map();
  tf(tokens).forEach((c, t) => v.set(t, (1 + Math.log(c)) * (IDF.get(t) || 0.5)));
  return v;
};
const norm = (v) => Math.sqrt([...v.values()].reduce((s, x) => s + x * x, 0)) || 1;
ALL_CHUNKS.forEach((c) => { c.vec = vec(c.tokens); c.norm = norm(c.vec); });

const displayScore = (cos) => (cos <= 0 ? 0 : Math.min(0.99, 0.3 + cos * 1.5));

function retrieve(query, k = 3) {
  const qt = tokenize(query);
  const qv = vec(qt);
  const qn = norm(qv);
  return ALL_CHUNKS.map((c) => {
    let dot = 0;
    qv.forEach((w, t) => { if (c.vec.has(t)) dot += w * c.vec.get(t); });
    const cos = dot / (qn * c.norm);
    return { chunk: c, cos, score: displayScore(cos) };
  })
    .sort((a, b) => b.cos - a.cos)
    .slice(0, k);
}

function generateAnswer(query) {
  const hits = retrieve(query, 4);
  if (!hits.length || hits[0].cos < 0.07) {
    return {
      text: "I couldn't find anything in the campus knowledge base that answers that confidently. Try asking about clubs, events, joining a club, starting a new club or venue booking.",
      sources: [],
    };
  }
  const keep = hits.filter((h) => h.cos >= Math.max(0.07, hits[0].cos * 0.5)).slice(0, 3);
  const parts = keep.slice(0, 2).map((h) => h.chunk.ans);
  const text = `${parts.join("\n\n")}\n\nThis answer is grounded in ${keep.length} retrieved document chunk${keep.length > 1 ? "s" : ""}. Expand the sources below to verify.`;
  return { text, sources: keep };
}

/* =====================================================================
   3. SMALL UI HELPERS
   ===================================================================== */

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
);

const Modal = ({ open, onClose, children, wide }) => {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl`}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-slate-500 shadow hover:text-slate-900">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

const scoreColor = (s) => (s >= 0.7 ? "bg-emerald-500" : s >= 0.5 ? "bg-indigo-500" : "bg-amber-500");

const SourceChip = ({ hit }) => {
  const [open, setOpen] = useState(false);
  const { chunk, score } = hit;
  return (
    <div className="rounded-xl border border-indigo-100 bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <FileText size={14} className="shrink-0 text-indigo-500" />
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{chunk.doc.title}</span>
        <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700">sim {score.toFixed(2)}</span>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && (
        <div className="space-y-2 border-t border-indigo-100 px-3 py-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <code className="rounded bg-slate-100 px-1.5 py-0.5">{chunk.doc.file}</code>
            <span className="flex items-center gap-1"><Hash size={11} />{chunk.id}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full ${scoreColor(score)}`} style={{ width: `${score * 100}%` }} />
          </div>
          <p className="rounded-lg bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-700">“{chunk.text}”</p>
        </div>
      )}
    </div>
  );
};

/* =====================================================================
   4. TAB 1: CHATBOT
   ===================================================================== */

const PILLS = [
  "How do I join a club?", "Which clubs are recruiting?", "When is the hackathon?",
  "How do I start a new club?", "Venue booking rules", "When does the photography club meet?",
];

function ChatTab() {
  const [messages, setMessages] = useState([
    {
      role: "bot", sources: [],
      text: "Hi, I'm CampusPulse AI 👋 I answer questions about clubs, events and campus policies using retrieval over our official documents. Every answer shows the exact sources it was grounded on.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState("");
  const endRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, typing, stage]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (q) => {
    const text = (q ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    setStage("Embedding query…");
    timers.current.push(setTimeout(() => setStage("Searching vector index…"), 450));
    timers.current.push(setTimeout(() => setStage("Generating grounded answer…"), 950));
    timers.current.push(setTimeout(() => {
      const res = generateAnswer(text);
      setMessages((m) => [...m, { role: "bot", ...res }]);
      setTyping(false);
      setStage("");
    }, 1500));
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-190px)] min-h-[480px] max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white">
        <div className="rounded-xl bg-white/20 p-2"><Bot size={20} /></div>
        <div>
          <div className="font-semibold">RAG Assistant</div>
          <div className="text-xs text-indigo-100">{ALL_CHUNKS.length} chunks indexed · {KB_DOCS.length} documents</div>
        </div>
        <Badge className="ml-auto bg-emerald-400/20 text-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Online</Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] ${m.role === "user" ? "" : "w-full sm:max-w-[82%]"}`}>
              <div className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.role === "user" ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
              }`}>
                {m.text}
              </div>
              {m.role === "bot" && m.sources?.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                    <Layers size={12} /> Source Documents & RAG Grounding
                  </div>
                  {m.sources.map((h) => <SourceChip key={h.chunk.id} hit={h} />)}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
            <span className="text-xs text-slate-500">{stage}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {PILLS.map((p) => (
            <button key={p} onClick={() => send(p)} disabled={typing}
              className="flex shrink-0 items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50">
              <Sparkles size={12} />{p}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about clubs, events or policies…"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
          <button type="submit" disabled={!input.trim() || typing}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40">
            <Send size={16} /><span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

/* =====================================================================
   5. TAB 2: CLUBS
   ===================================================================== */

function ClubsTab({ joined, onJoin, toast }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", year: "1st Year", note: "" });
  const [errors, setErrors] = useState({});

  const list = useMemo(() => CLUBS.filter((c) =>
    (cat === "All" || c.category === cat) &&
    `${c.name} ${c.desc} ${c.category} ${c.location}`.toLowerCase().includes(q.toLowerCase())
  ), [q, cat]);

  const openModal = (c) => { setActive(c); setErrors({}); };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email";
    setErrors(er);
    if (Object.keys(er).length) return;
    const waitlist = active.status === "Closed";
    onJoin(active.id);
    toast(waitlist ? `Added to the ${active.name} waitlist` : `Application sent to ${active.name}`, "success");
    setActive(null);
    setForm({ name: "", email: "", year: "1st Year", note: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs by name, topic or location…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Tech", "Arts", "Finance", "Eco"].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${cat === c ? "bg-indigo-600 text-white shadow" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          <Search className="mx-auto mb-2 text-slate-300" size={32} />No clubs match your search.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {list.map((c) => {
            const Icon = c.icon;
            const isJoined = joined.includes(c.id);
            return (
              <div key={c.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`flex items-center justify-between bg-gradient-to-r ${c.grad} p-4 text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/20 p-2.5"><Icon size={22} /></div>
                    <div>
                      <div className="font-semibold leading-tight">{c.name}</div>
                      <div className="text-xs text-white/80">Led by {c.lead}</div>
                    </div>
                  </div>
                  <Badge className={c.status === "Open" ? "bg-white text-emerald-700" : "bg-white/90 text-rose-600"}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.status === "Open" ? "bg-emerald-500" : "bg-rose-500"}`} />{c.status}
                  </Badge>
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-sm text-slate-600">{c.desc}</p>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" />{c.meeting}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" />{c.location}</div>
                    <div className="flex items-center gap-2"><Users size={14} className="text-indigo-500" />{c.members + (isJoined ? 1 : 0)} members</div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Badge className={c.chip}>{c.category}</Badge>
                    {isJoined ? (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><CheckCircle2 size={16} />{c.status === "Closed" ? "On waitlist" : "Applied"}</span>
                    ) : (
                      <button onClick={() => openModal(c)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${c.status === "Open" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                        {c.status === "Open" ? "Join Club" : "Join Waitlist"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <form onSubmit={submit} noValidate>
            <div className={`bg-gradient-to-r ${active.grad} p-6 text-white`}>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80">{active.status === "Open" ? "Membership application" : "Waitlist request"}</div>
              <div className="mt-1 text-xl font-bold">{active.name}</div>
              <div className="mt-1 text-sm text-white/80">{active.meeting} · {active.location}</div>
            </div>
            <div className="space-y-4 p-6">
              {active.status === "Closed" && (
                <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                  <Info size={16} className="shrink-0" />Recruitment is closed. You'll be notified when the January 2027 intake opens.
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Full name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Student email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@campuspulse.edu"
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Year of study</label>
                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
                  {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Why do you want to join?</label>
                <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setActive(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                  {active.status === "Open" ? "Submit Application" : "Join Waitlist"}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* =====================================================================
   6. TAB 3: EVENTS
   ===================================================================== */

function EventsTab({ rsvps, onRsvp, toast }) {
  const [tag, setTag] = useState("All");
  const [active, setActive] = useState(null);
  const [pending, setPending] = useState(false);

  const list = EVENTS.filter((e) => tag === "All" || e.tags.includes(tag));
  const seatsLeft = (e) => e.seats - (rsvps.includes(e.id) ? 1 : 0);

  const doRsvp = (e) => {
    setPending(true);
    setTimeout(() => {
      onRsvp(e.id);
      setPending(false);
      toast(`You're in! RSVP confirmed for ${e.title}`, "success");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Filter</span>
        {["All", "Tech", "Arts", "Finance", "Eco"].map((t) => (
          <button key={t} onClick={() => setTag(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tag === t ? "bg-indigo-600 text-white shadow" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{rsvps.length} RSVP{rsvps.length !== 1 && "s"} confirmed</span>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">No events with this tag.</div>
      ) : (
        <div className="space-y-4">
          {list.map((e) => {
            const done = rsvps.includes(e.id);
            return (
              <div key={e.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
                <div className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${e.grad} text-white shadow`}>
                  <span className="text-xs font-bold tracking-widest">{e.month}</span>
                  <span className="text-3xl font-extrabold leading-none">{e.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => <Badge key={t} className="bg-indigo-50 text-indigo-700">{t}</Badge>)}
                  </div>
                  <button onClick={() => setActive(e)} className="text-left text-lg font-bold text-slate-900 hover:text-indigo-700">{e.title}</button>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={13} />{e.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} />{e.venue}</span>
                    <span className="flex items-center gap-1"><Ticket size={13} />{seatsLeft(e)} seats left</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button onClick={() => setActive(e)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Details</button>
                  {done ? (
                    <span className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={16} />Going</span>
                  ) : (
                    <button onClick={() => doRsvp(e)} disabled={pending}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">RSVP Now</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} wide>
        {active && (() => {
          const done = rsvps.includes(active.id);
          return (
            <div>
              <div className={`bg-gradient-to-br ${active.grad} p-6 text-white`}>
                <div className="flex flex-wrap gap-1.5">{active.tags.map((t) => <Badge key={t} className="bg-white/20 text-white">{t}</Badge>)}</div>
                <h3 className="mt-2 text-2xl font-bold">{active.title}</h3>
                <div className="mt-1 text-sm text-white/85">Hosted by {active.host}</div>
              </div>
              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[[Calendar, "Date", active.dateLabel], [Clock, "Time", active.time], [MapPin, "Venue", active.venue]].map(([I, l, v]) => (
                    <div key={l} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase text-slate-500"><I size={12} />{l}</div>
                      <div className="mt-1 text-sm font-medium text-slate-800">{v}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{active.desc}</p>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Agenda</div>
                  <ul className="space-y-1.5">
                    {active.agenda.map((a) => <li key={a} className="flex items-start gap-2 text-sm text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />{a}</li>)}
                  </ul>
                </div>
                <div className="text-xs text-slate-500">RSVP link: <span className="font-mono text-indigo-600">{active.rsvp}</span> · {seatsLeft(active)} of {active.seats} seats left</div>
                {done ? (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-800">RSVP confirmed</div>
                      <div className="text-xs text-emerald-700">A calendar reminder will be sent to your campus email.</div>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => doRsvp(active)} disabled={pending}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                    {pending ? "Confirming…" : "RSVP Now"}
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

/* =====================================================================
   7. TAB 4: RAG VECTOR INSPECTOR
   ===================================================================== */

function InspectorTab({ toast }) {
  const [status, setStatus] = useState(() => Object.fromEntries(KB_DOCS.map((d) => [d.id, "indexed"])));
  const [progress, setProgress] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0);
  const [result, setResult] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  const reindex = () => {
    if (progress !== null) return;
    setStatus(Object.fromEntries(KB_DOCS.map((d) => [d.id, "queued"])));
    let i = 0;
    setProgress(0);
    timer.current = setInterval(() => {
      i += 1;
      setStatus((s) => {
        const n = { ...s };
        KB_DOCS.forEach((d, idx) => { n[d.id] = idx < i ? "indexed" : idx === i ? "embedding" : "queued"; });
        return n;
      });
      setProgress(Math.round((i / KB_DOCS.length) * 100));
      if (i >= KB_DOCS.length) {
        clearInterval(timer.current);
        setTimeout(() => { setProgress(null); toast("Vector index rebuilt successfully", "success"); }, 400);
      }
    }, 350);
  };

  const run = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    const t0 = performance.now();
    const hits = retrieve(query, ALL_CHUNKS.length);
    setResult({ q: query, tokens: [...new Set(tokenize(query))], hits, ms: Math.max(1, Math.round(performance.now() - t0)) + Math.floor(Math.random() * 6) });
  };

  const shown = result ? result.hits.filter((h) => h.score >= threshold && h.cos > 0).slice(0, topK) : [];
  const stat = (I, label, val, c) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-2 inline-flex rounded-lg p-2 ${c}`}><I size={18} /></div>
      <div className="text-2xl font-extrabold text-slate-900">{val}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
  const pill = {
    indexed: "bg-emerald-50 text-emerald-700", embedding: "bg-amber-50 text-amber-700", queued: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stat(FileText, "Documents", KB_DOCS.length, "bg-indigo-50 text-indigo-600")}
        {stat(Layers, "Total chunks", ALL_CHUNKS.length, "bg-violet-50 text-violet-600")}
        {stat(Database, "Vocabulary terms", IDF.size, "bg-sky-50 text-sky-600")}
        {stat(Activity, "Embedding dims (simulated)", 384, "bg-emerald-50 text-emerald-600")}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div>
            <div className="font-semibold text-slate-900">Indexed Documents</div>
            <div className="text-xs text-slate-500">Index: campuspulse-kb · cosine similarity · TF-IDF vectors</div>
          </div>
          <button onClick={reindex} disabled={progress !== null}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
            <RefreshCw size={14} className={progress !== null ? "animate-spin" : ""} />{progress !== null ? `Indexing ${progress}%` : "Re-index all"}
          </button>
        </div>
        {progress !== null && <div className="h-1 bg-slate-100"><div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} /></div>}
        <div className="divide-y divide-slate-100">
          {KB_DOCS.map((d) => (
            <div key={d.id}>
              <button onClick={() => setExpanded(expanded === d.id ? null : d.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50">
                <FileText size={16} className="shrink-0 text-indigo-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-800">{d.title}</div>
                  <div className="truncate font-mono text-[11px] text-slate-400">{d.file} · {d.pages} pages</div>
                </div>
                <Badge className="hidden bg-slate-100 capitalize text-slate-600 sm:inline-flex">{d.type}</Badge>
                <span className="text-xs text-slate-500">{d.chunks.length} chunk{d.chunks.length > 1 && "s"}</span>
                <Badge className={pill[status[d.id]]}>{status[d.id]}</Badge>
                {expanded === d.id ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>
              {expanded === d.id && (
                <div className="space-y-2 bg-slate-50 px-4 py-3">
                  {ALL_CHUNKS.filter((c) => c.docId === d.id).map((c) => (
                    <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500"><Hash size={11} />{c.id} · {c.tokens.length} tokens</div>
                      <p className="text-xs leading-relaxed text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900"><Zap size={18} className="text-amber-500" />Similarity Tester</div>
        <p className="mb-4 text-xs text-slate-500">Enter any search term to see how every chunk ranks against it in the vector index.</p>
        <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Try "venue approval" or "robot hackathon prizes"'
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Run Query</button>
        </form>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">Top-K: <span className="text-indigo-600">{topK}</span>
            <input type="range" min={1} max={10} value={topK} onChange={(e) => setTopK(+e.target.value)} className="mt-1 w-full accent-indigo-600" />
          </label>
          <label className="text-xs font-semibold text-slate-600">Min similarity: <span className="text-indigo-600">{threshold.toFixed(2)}</span>
            <input type="range" min={0} max={0.9} step={0.05} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-1 w-full accent-indigo-600" />
          </label>
        </div>

        {result && (
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Query tokens:</span>
              {result.tokens.map((t) => <code key={t} className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700">{t}</code>)}
              <span className="ml-auto">{shown.length} result{shown.length !== 1 && "s"} · {result.ms} ms</span>
            </div>
            {shown.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">No chunks pass the current similarity threshold.</div>
            ) : shown.map((h, i) => (
              <div key={h.chunk.id} className="rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{h.chunk.doc.title}</span>
                  <span className="text-sm font-bold text-indigo-700">{h.score.toFixed(3)}</span>
                </div>
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${scoreColor(h.score)}`} style={{ width: `${h.score * 100}%` }} /></div>
                <p className="text-xs leading-relaxed text-slate-600">{h.chunk.text}</p>
                <div className="mt-1.5 font-mono text-[10px] text-slate-400">{h.chunk.id} · raw cosine {h.cos.toFixed(4)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   8. APP SHELL
   ===================================================================== */

const TABS = [
  { id: "chat", label: "AI Chatbot", icon: Bot },
  { id: "clubs", label: "Explore Clubs", icon: Users },
  { id: "events", label: "Event Calendar", icon: Calendar },
  { id: "inspector", label: "Vector Inspector", icon: Database },
];

export default function CampusPulseAI() {
  const [tab, setTab] = useState("chat");
  const [joined, setJoined] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-2 text-white shadow"><GraduationCap size={22} /></div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight text-slate-900">CampusPulse <span className="text-indigo-600">AI</span></h1>
            <p className="text-[11px] text-slate-500">Clubs · Events · Campus Policies</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:block">Tue, Oct 27, 2026</span>
            <div className="relative rounded-full bg-slate-100 p-2 text-slate-600">
              <Bell size={16} />
              {(joined.length + rsvps.length) > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">{joined.length + rsvps.length}</span>
              )}
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map(({ id, label, icon: I }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${tab === id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              <I size={16} />{label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "chat" && <ChatTab />}
        {tab === "clubs" && <ClubsTab joined={joined} onJoin={(id) => setJoined((j) => [...j, id])} toast={toast} />}
        {tab === "events" && <EventsTab rsvps={rsvps} onRsvp={(id) => setRsvps((r) => [...r, id])} toast={toast} />}
        {tab === "inspector" && <InspectorTab toast={toast} />}
      </main>

      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />{t.message}
          </div>
        ))}
      </div>
    </div>
  );
}