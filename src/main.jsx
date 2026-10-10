import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Headphones,
  Laptop,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageCircle,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

const COURSES = [
  {
    id: "fullstack",
    title: "Full Stack Development",
    category: "Development",
    level: "Beginner to advanced",
    duration: "6 months",
    lessons: 48,
    price: 12999,
    oldPrice: 16999,
    rating: "4.9",
    learners: "2.4k",
    icon: Code2,
    color: "lavender",
    description:
      "Build responsive websites and production-minded applications with modern frontend and backend tools.",
    skills: ["HTML & CSS", "JavaScript", "React", "Node.js", "Databases", "Deployment"],
    outcomes: [
      "Build 3 portfolio-ready projects",
      "Understand API and database design",
      "Deploy a full-stack application",
    ],
  },
  {
    id: "data",
    title: "Data Science & Analytics",
    category: "Data",
    level: "Beginner friendly",
    duration: "5 months",
    lessons: 42,
    price: 14999,
    oldPrice: 18999,
    rating: "4.8",
    learners: "1.8k",
    icon: Brain,
    color: "peach",
    description:
      "Turn raw data into useful decisions through Python, analytics, statistics and practical case studies.",
    skills: ["Python", "SQL", "Statistics", "Pandas", "Visualisation", "Projects"],
    outcomes: [
      "Analyse real-world datasets",
      "Build clear data dashboards",
      "Present evidence-based insights",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Computing & DevOps",
    category: "Cloud",
    level: "Beginner to intermediate",
    duration: "4 months",
    lessons: 36,
    price: 11999,
    oldPrice: 15999,
    rating: "4.9",
    learners: "1.5k",
    icon: Zap,
    color: "gold",
    description:
      "Learn cloud fundamentals, containers, CI/CD and deployment workflows with guided labs.",
    skills: ["Cloud fundamentals", "Linux", "Docker", "CI/CD", "Networking", "Monitoring"],
    outcomes: [
      "Deploy a cloud-hosted app",
      "Create a basic CI/CD pipeline",
      "Practise production troubleshooting",
    ],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    category: "AI / ML",
    level: "Beginner friendly",
    duration: "5 months",
    lessons: 44,
    price: 15999,
    oldPrice: 19999,
    rating: "4.9",
    learners: "2.1k",
    icon: Sparkles,
    color: "rose",
    description:
      "Explore machine learning and practical AI workflows while building projects with responsible AI practices.",
    skills: ["Python", "ML foundations", "Model evaluation", "AI APIs", "Prompt design", "Capstone"],
    outcomes: [
      "Train and evaluate a model",
      "Prototype an AI-powered tool",
      "Explain limitations and responsible use",
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Product Design",
    category: "Design",
    level: "Beginner friendly",
    duration: "3 months",
    lessons: 28,
    price: 8999,
    oldPrice: 11999,
    rating: "4.8",
    learners: "980",
    icon: Laptop,
    color: "lavender",
    description:
      "Learn user research, information architecture, wireframing and polished interface design.",
    skills: ["Research", "User flows", "Wireframes", "Figma", "Prototyping", "Usability"],
    outcomes: [
      "Create a clickable prototype",
      "Build a case-study portfolio",
      "Run a simple usability test",
    ],
  },
  {
    id: "python",
    title: "Python Programming",
    category: "Development",
    level: "Beginner friendly",
    duration: "10 weeks",
    lessons: 24,
    price: 5999,
    oldPrice: 7999,
    rating: "4.7",
    learners: "3.2k",
    icon: Code2,
    color: "peach",
    description:
      "Develop a strong programming foundation with hands-on exercises and mini projects.",
    skills: ["Syntax", "Data structures", "Functions", "Files", "APIs", "Mini projects"],
    outcomes: [
      "Write clean Python scripts",
      "Work with files and APIs",
      "Build small automation tools",
    ],
  },
];

const FAQS = [
  [
    "Are classes live or recorded?",
    "Programs can include scheduled live sessions and recordings, depending on the course. The course page and your enrolment details should specify what is included.",
  ],
  [
    "Can I attend a free demo before paying?",
    "Yes. Submit the demo or counselling form and the Yugva team can contact you to coordinate a suitable session. Submitting a request does not require payment.",
  ],
  [
    "Do you guarantee a job or placement?",
    "No job or placement is guaranteed. Career support may include resume feedback, mock interviews, profile optimisation, job alerts or referrals where available. The exact support depends on the course and written terms.",
  ],
  [
    "When do I receive a certificate?",
    "A certificate may be made available after you meet the published course completion requirements. Requirements and certificate eligibility should be confirmed for your selected course.",
  ],
  [
    "What is the refund policy?",
    "Review the written refund and cancellation terms before paying. If terms are not shown at checkout, contact the Yugva team and request them in writing before completing enrolment.",
  ],
];

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function Brand({ compact = false, onClick }) {
  return (
    <button className={`brand ${compact ? "brand-compact" : ""}`} onClick={onClick} aria-label="Yugva home">
      <img
        src="/yugva-logo.png"
        alt=""
        className="brand-img"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <span className="brand-fallback">
        <span className="brand-mark">
          <BookOpen size={20} />
          <Sparkles size={13} />
        </span>
        <span>
          <b>Yugva</b>
          {!compact && <small>Learn. Grow. Achieve.</small>}
        </span>
      </span>
    </button>
  );
}

function Button({ children, variant = "primary", onClick, type = "button", className = "", disabled = false, block = false }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn btn-${variant} ${block ? "btn-block" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modal, setModal] = useState("");
  const [toast, setToast] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [mobileNav, setMobileNav] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Full Stack Development",
    goal: "Explore a course",
    consent: false,
  });
  const [faqOpen, setFaqOpen] = useState(0);
  const [enrolled, setEnrolled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yugva_enrolled") || "[]");
    } catch {
      return [];
    }
  });
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yugva_lessons") || "{}");
    } catch {
      return {};
    }
  });
  const [submittedAssignments, setSubmittedAssignments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yugva_assignments") || "[]");
    } catch {
      return [];
    }
  });
  const [leads, setLeads] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yugva_leads") || "[]");
    } catch {
      return [];
    }
  });
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    localStorage.setItem("yugva_enrolled", JSON.stringify(enrolled));
  }, [enrolled]);

  useEffect(() => {
    localStorage.setItem("yugva_lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("yugva_assignments", JSON.stringify(submittedAssignments));
  }, [submittedAssignments]);

  useEffect(() => {
    localStorage.setItem("yugva_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const go = (next) => {
    setPage(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    go("course");
  };

  const showToast = (message) => setToast(message);

  const categories = ["All", "Development", "Data", "Cloud", "AI / ML", "Design"];

  const filteredCourses = useMemo(
    () =>
      COURSES.filter(
        (course) =>
          (category === "All" || course.category === category) &&
          `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );

  const currentEnrolment = enrolled.find((item) => item.courseId === selectedCourse.id);
  const enrolledCourses = enrolled
    .map((item) => ({ ...item, course: COURSES.find((course) => course.id === item.courseId) }))
    .filter((item) => item.course);

  const setFormField = (key, value) =>
    setLeadForm((old) => ({
      ...old,
      [key]: value,
    }));

  function submitLead(e) {
    e.preventDefault();

    if (!leadForm.consent) {
      showToast("Please accept the privacy consent to continue.");
      return;
    }

    const lead = {
      ...leadForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "Request received",
    };

    setLeads((old) => [lead, ...old]);
    setModal("");
    setLeadForm({
      name: "",
      email: "",
      phone: "",
      interest: selectedCourse?.title || "Full Stack Development",
      goal: "Explore a course",
      consent: false,
    });

    showToast("Request saved on this device. The demo form is not connected to a live team.");
    go("thankyou");
  }

  function startEnrolment() {
    if (enrolled.some((item) => item.courseId === selectedCourse.id)) {
      go("learning");
      return;
    }
    go("checkout");
  }

  function confirmPayment() {
    const item = {
      courseId: selectedCourse.id,
      enrolledAt: new Date().toISOString(),
      orderId: `YGV-${Math.floor(100000 + Math.random() * 900000)}`,
      method: payMethod,
    };

    setEnrolled((old) => [...old, item]);
    showToast("Demo enrolment created. No payment was processed.");
    go("learning");
  }

  function markLesson() {
    setCompletedLessons((old) => ({
      ...old,
      [selectedCourse.id]: [...new Set([...(old[selectedCourse.id] || []), activeLesson])],
    }));
    showToast("Lesson marked complete.");
  }

  function submitAssignment(title) {
    setSubmittedAssignments((old) => (old.includes(title) ? old : [...old, title]));
    showToast("Assignment submission recorded locally.");
  }

  const nav = [
    ["Courses", "catalogue"],
    ["How it works", "journey"],
    ["Career support", "career"],
    ["About", "about"],
  ];

  const Header = () => (
    <header className="site-header">
      <div className="header-inner">
        <Brand onClick={() => go("home")} />
        <nav className={`main-nav ${mobileNav ? "nav-open" : ""}`}>
          {nav.map(([label, target]) => (
            <button key={target} onClick={() => go(target)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="text-login" onClick={() => go("learning")}>
            Student portal
          </button>
          <Button
            onClick={() => {
              setLeadForm((old) => ({ ...old, goal: "Book a free demo" }));
              setModal("lead");
            }}
          >
            Book a free demo <ArrowUpRight size={15} />
          </Button>
        </div>
        <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMobileNav((value) => !value)}>
          {mobileNav ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand onClick={() => go("home")} />
          <p className="footer-copy">Practical learning for the next step in your career.</p>
          <div className="footer-social">
            <span>in</span>
            <span>◎</span>
            <span>▶</span>
          </div>
        </div>
        <div>
          <b>Explore</b>
          <button onClick={() => go("catalogue")}>All courses</button>
          <button onClick={() => go("journey")}>How it works</button>
          <button onClick={() => go("career")}>Career support</button>
        </div>
        <div>
          <b>For learners</b>
          <button onClick={() => setModal("lead")}>Free demo</button>
          <button onClick={() => go("learning")}>Learning portal</button>
          <button onClick={() => go("faq")}>FAQs</button>
        </div>
        <div>
          <b>Contact & policies</b>
          <p>Questions about a course or enrolment?</p>
          <button onClick={() => setModal("lead")}>
            Request a call <ArrowRight size={14} />
          </button>
          <button onClick={() => go("terms")}>Terms & learner policies</button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Yugva Learning. All rights reserved.</span>
        <span>Learning outcomes depend on learner participation. Placement is not guaranteed.</span>
      </div>
    </footer>
  );

  const CourseCard = ({ course }) => {
    const Icon = course.icon;
    return (
      <article className="course-card">
        <div className={`course-icon ${course.color}`}>
          <Icon size={23} />
        </div>
        <div className="course-card-top">
          <span className="eyebrow">{course.category}</span>
          <span className="rating">
            <Star size={13} fill="currentColor" /> {course.rating}
          </span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>
            <Clock3 size={14} />
            {course.duration}
          </span>
          <span>
            <Play size={14} />
            {course.lessons} lessons
          </span>
        </div>
        <div className="course-card-bottom">
          <div>
            <b>{money(course.price)}</b>
            <del>{money(course.oldPrice)}</del>
          </div>
          <button className="arrow-btn" aria-label={`View ${course.title}`} onClick={() => openCourse(course)}>
            <ArrowUpRight size={19} />
          </button>
        </div>
      </article>
    );
  };

  const Home = () => (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill">
              <span className="pill-dot" /> SKILLS FOR WHAT'S NEXT
            </div>
            <h1>
              Learn today.
              <br />
              <em>Build tomorrow.</em>
            </h1>
            <p className="hero-desc">
              Build job-ready skills with expert mentors, practical projects and learning support that moves you forward.
            </p>
            <div className="hero-ctas">
              <Button onClick={() => go("catalogue")}>
                Explore courses <ArrowRight size={17} />
              </Button>
              <Button variant="outline" onClick={() => setModal("lead")}>
                <Play size={15} /> Book a free demo
              </Button>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack">
                <span>R</span>
                <span>A</span>
                <span>S</span>
                <span>+</span>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <small>Learning built around your goals</small>
              </div>
            </div>
            <div className="hero-stats">
              <div>
                <b>Live + recorded</b>
                <span>Flexible learning</span>
              </div>
              <div>
                <b>Project-led</b>
                <span>Practice as you learn</span>
              </div>
              <div>
                <b>Career support</b>
                <span>Clear terms, no guarantees</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob" />
            <div className="hero-image-card">
              <div className="hero-photo-placeholder">
                <div className="photo-orbit orbit-one" />
                <div className="photo-orbit orbit-two" />
                <div className="student-illustration">
                  <div className="student-hair" />
                  <div className="student-head" />
                  <div className="student-body" />
                  <div className="student-book" />
                </div>
                <span className="sparkle s1">✦</span>
                <span className="sparkle s2">✧</span>
                <span className="sparkle s3">✦</span>
              </div>
              <div className="floating-note note-top">
                <span className="note-icon">
                  <Video size={16} />
                </span>
                <span>
                  <b>Live learning</b>
                  <small>Learn with a mentor</small>
                </span>
              </div>
              <div className="floating-note note-bottom">
                <span className="note-check">
                  <Check size={17} />
                </span>
                <span>
                  <b>Small steps. Real progress.</b>
                  <small>Your journey, at your pace</small>
                </span>
              </div>
            </div>
            <div className="hero-caption">
              <span>01 / YOUR NEXT CHAPTER</span>
              <span>Curiosity into capability ↗</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <span>LEARN BY DOING</span>
          <i />
          <span>MENTOR GUIDANCE</span>
          <i />
          <span>REAL PROJECTS</span>
          <i />
          <span>CAREER READINESS</span>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR DIRECTION</span>
            <h2>
              Skills that open <em>new doors.</em>
            </h2>
            <p>Choose a learning path that matches your interests and where you want to go.</p>
          </div>
          <button className="link-arrow" onClick={() => go("catalogue")}>
            View all courses <ArrowRight size={16} />
          </button>
        </div>
        <div className="course-grid">
          {COURSES.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="feature-band">
        <div className="container feature-grid">
          <div>
            <span className="eyebrow light">THE YUGVA APPROACH</span>
            <h2>
              Learning should feel
              <br />
              <em>like forward motion.</em>
            </h2>
            <p>Get a clear path, structured practice and guidance when you need it—not just a library of videos.</p>
            <Button variant="light" onClick={() => go("journey")}>
              See how it works <ArrowRight size={16} />
            </Button>
          </div>
          <div className="feature-list">
            <div>
              <span>01</span>
              <div>
                <b>Learn with structure</b>
                <p>Follow a syllabus with clear milestones and learning resources.</p>
              </div>
              <BookOpen />
            </div>
            <div>
              <span>02</span>
              <div>
                <b>Make it practical</b>
                <p>Apply concepts through exercises, assignments and portfolio projects.</p>
              </div>
              <Code2 />
            </div>
            <div>
              <span>03</span>
              <div>
                <b>Keep moving forward</b>
                <p>Track progress and explore career preparation resources.</p>
              </div>
              <Target />
            </div>
          </div>
        </div>
      </section>

      <section className="section container faq-preview">
        <div>
          <span className="eyebrow">GOOD TO KNOW</span>
          <h2>
            Questions before <em>you begin?</em>
          </h2>
          <p>Review course details and written terms before enrolling.</p>
          <button className="link-arrow" onClick={() => go("faq")}>
            Visit FAQs <ArrowRight size={16} />
          </button>
        </div>
        <div className="faq-list">
          {FAQS.slice(0, 3).map(([question, answer], index) => (
            <div className={`faq-item ${faqOpen === index ? "open" : ""}`} key={question}>
              <button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}>
                {question}
                <ChevronDown size={17} />
              </button>
              {faqOpen === index && <p>{answer}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div>
            <span className="eyebrow light">YOUR NEXT STEP STARTS HERE</span>
            <h2>
              Curious about a course?
              <br />
              <em>Let's talk it through.</em>
            </h2>
            <p>Request a free demo or counselling call before you decide.</p>
          </div>
          <Button variant="light" onClick={() => setModal("lead")}>
            Book a free demo <ArrowUpRight size={17} />
          </Button>
        </div>
      </section>
    </>
  );

  const Catalogue = () => (
    <main className="page-main container">
      <div className="page-intro">
        <span className="eyebrow">COURSE CATALOGUE</span>
        <h1>
          Find the skill you want <em>to grow.</em>
        </h1>
        <p>Compare course focus, duration, fees and learning format before you choose.</p>
      </div>

      <div className="catalogue-tools">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, skills or topics" />
        </label>
        <div className="category-pills">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalogue-results">
        <span>{filteredCourses.length} courses to explore</span>
        <span>Fees shown in INR · Demo requests are free</span>
      </div>

      {filteredCourses.length ? (
        <div className="course-grid catalogue-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h3>No matching courses</h3>
          <p>Try another search term or category.</p>
          <Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>
            Clear filters
          </Button>
        </div>
      )}
    </main>
  );

  const CourseDetail = () => {
    const SelectedIcon = selectedCourse.icon;

    return (
      <main className="course-detail-page">
        <section className="course-hero">
          <div className="container course-hero-grid">
            <div>
              <div className="breadcrumbs">
                <button onClick={() => go("home")}>Home</button>
                <span>/</span>
                <button onClick={() => go("catalogue")}>Courses</button>
                <span>/</span>
                <span>{selectedCourse.title}</span>
              </div>
              <span className="eyebrow light">{selectedCourse.category.toUpperCase()} PATHWAY</span>
              <h1>{selectedCourse.title}</h1>
              <p>{selectedCourse.description}</p>
              <div className="detail-badges">
                <span>
                  <Clock3 size={15} />
                  {selectedCourse.duration}
                </span>
                <span>
                  <Play size={15} />
                  {selectedCourse.lessons} lessons
                </span>
                <span>
                  <Star size={15} fill="currentColor" />
                  {selectedCourse.rating} learner rating
                </span>
              </div>
              <div className="course-hero-actions">
                <Button variant="light" onClick={startEnrolment}>
                  {currentEnrolment ? "Go to learning portal" : "Enrol now"} <ArrowRight size={16} />
                </Button>
                <Button
                  variant="light-outline"
                  onClick={() => {
                    setLeadForm((old) => ({ ...old, interest: selectedCourse.title, goal: "Book a free demo" }));
                    setModal("lead");
                  }}
                >
                  <Play size={15} /> Watch free demo
                </Button>
              </div>
              <small className="course-disclaimer">
                Confirm syllabus, included support, payment terms and refund policy before enrolment.
              </small>
            </div>

            <div className="detail-art">
              <div className={`course-icon big ${selectedCourse.color}`}>
                <SelectedIcon size={45} />
              </div>
              <div className="art-code">
                <span>YUGVA / LEARNING PATH</span>
                <div className="art-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="art-window">
                  <span />
                  <span />
                  <span />
                  <b>Build your next skill.</b>
                  <small>Learn · Practise · Progress</small>
                </div>
              </div>
              <div className="art-spark">✦</div>
            </div>
          </div>
        </section>

        <section className="container detail-content">
          <div className="detail-main">
            <div className="detail-tabs">
              <a href="#overview">Overview</a>
              <a href="#syllabus">Syllabus</a>
              <a href="#outcomes">Outcomes</a>
              <a href="#career">Career support</a>
              <a href="#coursefaq">FAQs</a>
            </div>

            <section className="detail-section" id="overview">
              <h2>
                Why this course <em>works.</em>
              </h2>
              <p>
                This pathway is built around practical application, guided mentorship and measurable progress. Each module introduces concepts, builds project confidence and reinforces learning with real examples.
              </p>
              <div className="skill-chips">
                {selectedCourse.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>

            <section className="detail-section" id="syllabus">
              <h2>
                Module flow <em>at a glance.</em>
              </h2>
              <div className="timeline-list">
                {selectedCourse.outcomes.map((item, index) => (
                  <div key={item} className="timeline-row">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section" id="outcomes">
              <h2>
                Learner outcomes <em>you can track.</em>
              </h2>
              <ul className="outcome-list">
                {selectedCourse.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="info-card price-card">
              <span className="eyebrow">COURSE FEE</span>
              <b>{money(selectedCourse.price)}</b>
              <del>{money(selectedCourse.oldPrice)}</del>
              <small>Type and schedule may vary by cohort.</small>
            </div>
            <div className="info-card">
              <span className="eyebrow">WHAT'S INCLUDED</span>
              <ul>
                <li>Live classes and recordings</li>
                <li>Project-based learning</li>
                <li>Mentor guidance and feedback</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    );
  };

  const Journey = () => {
    const steps = [
      ["Discovery", "Explore courses, search results, previews and learning paths.", Compass],
      ["Evaluation", "Compare syllabus, duration, price, reviews, FAQs and demo content.", Search],
      ["Lead capture", "Request a free demo or counselling call with your course interest.", MessageCircle],
      ["Counselling", "Discuss suitability, goals, options, fees and enrolment terms.", Users],
      ["Enrolment & payment", "Review written terms and complete enrolment using the available payment flow.", CreditCard],
      ["Learning", "Access live classes where scheduled, recordings where included, resources and assignments.", Video],
      ["Completion", "Meet the published requirements; a certificate may then be made available.", Award],
      ["Career support", "Explore resume feedback, mock interviews, profile help, job alerts or referrals where included.", BriefcaseBusiness],
    ];

    return (
      <main className="page-main container">
        <div className="page-intro">
          <span className="eyebrow">THE YUGVA JOURNEY</span>
          <h1>
            Eight steps from curiosity <em>to capability.</em>
          </h1>
          <p>Here is the intended learner journey. Actual automation, timelines and service availability may vary by course and cohort.</p>
        </div>

        <div className="journey-timeline">
          {steps.map(([title, description, Icon], index) => (
            <article className="journey-step" key={title}>
              <div className="journey-step-icon">
                <Icon size={22} />
              </div>
              <div className="journey-step-content">
                <span className="eyebrow">STEP {String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                {index === 0 && (
                  <button className="link-arrow" onClick={() => go("catalogue")}>
                    Explore courses <ArrowRight size={15} />
                  </button>
                )}
                {index === 2 && (
                  <button className="link-arrow" onClick={() => setModal("lead")}>
                    Request a demo <ArrowRight size={15} />
                  </button>
                )}
                {index === 5 && (
                  <button className="link-arrow" onClick={() => go("learning")}>
                    Open learning portal <ArrowRight size={15} />
                  </button>
                )}
              </div>
              <div className="journey-step-side">{["Browse", "Compare", "Submit", "Discuss", "Confirm", "Practise", "Qualify", "Prepare"][index]}</div>
            </article>
          ))}
        </div>
      </main>
    );
  };

  const Learning = () => {
    const [tab, setTab] = useState("overview");
    const course = enrolledCourses[0]?.course || selectedCourse;
    const lessonList = [
      "Welcome & learning roadmap",
      "Core concepts and setup",
      "Guided practical exercise",
      "Project milestone",
    ];
    const done = completedLessons[course.id] || [];
    const progress = Math.round((done.length / lessonList.length) * 100);

    return (
      <main className="portal-wrap">
        <aside className="portal-sidebar">
          <Brand onClick={() => go("home")} />
          <span className="portal-label">LEARNER SPACE</span>
          <button className={tab === "overview" ? "selected" : ""} onClick={() => setTab("overview")}>
            <LayoutDashboard size={17} /> Overview
          </button>
          <button className={tab === "classes" ? "selected" : ""} onClick={() => setTab("classes")}>
            <Video size={17} /> Live classes
          </button>
          <button className={tab === "assignments" ? "selected" : ""} onClick={() => setTab("assignments")}>
            <ClipboardCheck size={17} /> Assignments
          </button>
          <button className={tab === "resources" ? "selected" : ""} onClick={() => setTab("resources")}>
            <BookOpen size={17} /> Resources
          </button>
          <button className={tab === "certificate" ? "selected" : ""} onClick={() => setTab("certificate")}>
            <Award size={17} /> Certificates
          </button>

          <div className="portal-sidebar-bottom">
            <div className="mini-user">
              <span>YR</span>
              <div>
                <b>Yugva learner</b>
                <small>Learning account demo</small>
              </div>
            </div>
            <button onClick={() => go("home")}>← Back to website</button>
          </div>
        </aside>

        <section className="portal-main">
          <div className="portal-topbar">
            <div>
              <span className="eyebrow">STUDENT PORTAL / {tab.toUpperCase()}</span>
              <h1>
                {tab === "overview" && "Your learning space"}
                {tab === "classes" && "Live classes & recordings"}
                {tab === "assignments" && "Assignments"}
                {tab === "resources" && "Learning resources"}
                {tab === "certificate" && "Completion & certificates"}
              </h1>
            </div>
            <button className="icon-btn" onClick={() => showToast("No new notifications in this demo.")}>
              <Bell size={18} />
            </button>
          </div>

          {tab === "overview" && (
            <>
              <div className="welcome-panel">
                <div>
                  <span className="eyebrow light">KEEP YOUR MOMENTUM</span>
                  <h2>Small steps add up.</h2>
                  <p>Continue with your current learning plan and keep building practical confidence.</p>
                </div>
                <Button variant="light" onClick={() => setTab("classes")}>
                  Continue learning <ArrowRight size={16} />
                </Button>
              </div>

              <div className="portal-grid">
                <div className="panel-card">
                  <span className="eyebrow">CURRENT TRACK</span>
                  <h3>{course.title}</h3>
                  <div className="progress-row">
                    <span>{progress}% complete</span>
                    <b>{done.length}/{lessonList.length} lessons</b>
                  </div>
                  <div className="progress-bar">
                    <i style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="panel-card">
                  <span className="eyebrow">NEXT LESSON</span>
                  <h3>{lessonList[activeLesson] || lessonList[0]}</h3>
                  <button className="link-arrow" onClick={() => setActiveLesson((old) => (old + 1) % lessonList.length)}>
                    Cycle lesson <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "classes" && (
            <div className="panel-card full-panel">
              <span className="eyebrow">LIVE CLASS SCHEDULE</span>
              <h3>Upcoming sessions</h3>
              <div className="schedule-list">
                <div>
                  <label>Monday</label>
                  <span>6:30 PM · Live mentoring</span>
                </div>
                <div>
                  <label>Wednesday</label>
                  <span>7:00 PM · Guided lab</span>
                </div>
                <div>
                  <label>Saturday</label>
                  <span>10:00 AM · Workshop</span>
                </div>
              </div>
            </div>
          )}

          {tab === "assignments" && (
            <div className="panel-card full-panel">
              <span className="eyebrow">ASSIGNMENTS</span>
              <h3>Submission tracker</h3>
              <ul className="assignment-list">
                {lessonList.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                    <button onClick={() => submitAssignment(item)}>
                      {submittedAssignments.includes(item) ? "Submitted" : "Submit"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "resources" && (
            <div className="panel-card full-panel">
              <span className="eyebrow">RESOURCES</span>
              <h3>Useful materials</h3>
              <div className="resource-list">
                <div>
                  <FileText size={18} />
                  <span>Course syllabus</span>
                </div>
                <div>
                  <Download size={18} />
                  <span>Downloadable checklist</span>
                </div>
                <div>
                  <Headphones size={18} />
                  <span>Mentor support notes</span>
                </div>
              </div>
            </div>
          )}

          {tab === "certificate" && (
            <div className="panel-card full-panel">
              <span className="eyebrow">CERTIFICATE</span>
              <h3>Completion status</h3>
              <p>
                {progress >= 100 ? "You are eligible for certificate review." : "Keep progressing through the learning activities to become eligible."}
              </p>
              <Button onClick={() => markLesson()}>Mark current lesson complete</Button>
            </div>
          )}
        </section>
      </main>
    );
  };

  const Checkout = () => (
    <main className="page-main container checkout-page">
      <div className="page-intro">
        <span className="eyebrow">ENROLMENT</span>
        <h1>
          One step closer to <em>your next skill.</em>
        </h1>
        <p>Review your selection and the demo payment flow before continuing.</p>
      </div>

      <div className="checkout-grid">
        <section className="checkout-form">
          <div className="checkout-steps">
            <span className="done">
              <Check size={13} /> Course
            </span>
            <i />
            <span className="current">02 Payment</span>
            <i />
            <span>03 Confirmation</span>
          </div>

          <h2>Choose a payment method</h2>
          <p className="muted">Prototype only. No payment gateway is connected and no money will be charged.</p>

          {[
            "UPI",
            "Credit / debit card",
            "Net banking",
            "Pay later / EMI (if available)",
          ].map((method) => (
            <button
              key={method}
              className={`payment-option ${payMethod === method ? "chosen" : ""}`}
              onClick={() => setPayMethod(method)}
            >
              <span className="payment-radio">{payMethod === method && <i />}</span>
              <span>{method}</span>
              {method === "UPI" && <span className="payment-tag">Popular</span>}
            </button>
          ))}

          <div className="terms-check">
            <ShieldCheck size={18} />
            <span>Before production launch, show the actual fee breakdown, payment provider, refund/cancellation policy and terms checkbox here.</span>
          </div>

          <Button block onClick={confirmPayment}>
            Confirm demo enrolment <ArrowRight size={16} />
          </Button>
        </section>

        <aside className="order-summary">
          <span className="eyebrow">ORDER SUMMARY</span>
          <div className="order-course">
            <div className={`course-icon ${selectedCourse.color}`}>
              <selectedCourse.icon size={22} />
            </div>
            <div>
              <b>{selectedCourse.title}</b>
              <small>{selectedCourse.duration} · Digital learning</small>
            </div>
          </div>
          <div className="summary-line">
            <span>Course fee (sample)</span>
            <b>{money(selectedCourse.price)}</b>
          </div>
          <div className="summary-line">
            <span>Taxes / other fees</span>
            <span>Confirm before payment</span>
          </div>
          <div className="summary-total">
            <span>Total shown</span>
            <b>{money(selectedCourse.price)}</b>
          </div>
          <small className="small-note">This is illustrative pricing, not a live offer. No payment will be charged in this demo.</small>
        </aside>
      </div>
    </main>
  );

  const Career = () => (
    <main className="page-main container">
      <div className="page-intro">
        <span className="eyebrow">CAREER SUPPORT</span>
        <h1>
          Build your skills. Prepare for <em>what comes next.</em>
        </h1>
        <p>Career readiness is a process. Understand what support may be available and what it does—and does not—promise.</p>
      </div>

      <div className="career-hero-card">
        <div>
          <span className="eyebrow light">CAREER READINESS TOOLKIT</span>
          <h2>
            Make your learning <em>visible.</em>
          </h2>
          <p>Build a portfolio, practise communicating your work and prepare to discuss your skills with confidence.</p>
          <Button variant="light" onClick={() => setModal("lead")}>
            Ask about course support <ArrowRight size={16} />
          </Button>
        </div>
        <div className="career-art">
          <BriefcaseBusiness size={78} />
          <span>YOUR NEXT CHAPTER</span>
        </div>
      </div>

      <div className="career-support-grid">
        {[
          [FileText, "Resume assistance", "Feedback on structure, clarity and how you present relevant skills."],
          [MessageCircle, "Mock interviews", "Practice answering questions and explaining your projects."],
          [Users, "Profile optimisation", "Guidance on presenting your work and professional profile."],
          [Bell, "Job alerts", "Information about relevant opportunities where available."],
          [ArrowUpRight, "Referrals", "Referrals may be offered where available; they are not guaranteed."],
          [Target, "Career planning", "Identify skill gaps and set practical next steps."],
        ].map(([Icon, title, description]) => (
          <article key={title}>
            <div className="support-icon">
              <Icon size={21} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="support-label">Availability depends on course terms</span>
          </article>
        ))}
      </div>

      <div className="policy-panel">
        <ShieldCheck size={25} />
        <div>
          <h3>Transparent placement-support terms</h3>
          <ul>
            <li>Yugva does not guarantee a job, placement, salary, interview or referral.</li>
            <li>Support services vary by course, cohort and written agreement.</li>
            <li>Ask for eligibility rules, duration, exclusions and any additional charges in writing.</li>
            <li>Outcomes depend on learner effort, skills, market conditions and employer decisions.</li>
            <li>Any employer or partner logos shown in future materials must reflect verified relationships.</li>
          </ul>
        </div>
      </div>
    </main>
  );

  const About = () => (
    <main className="page-main container">
      <div className="page-intro">
        <span className="eyebrow">ABOUT YUGVA</span>
        <h1>
          Learn with intention. <em>Grow with confidence.</em>
        </h1>
        <p>Yugva is designed around a simple idea: useful learning should combine clear expectations, guided practice and transparent next steps.</p>
      </div>

      <div className="about-grid">
        <div className="about-brand-card">
          <div className="about-logo">
            <BookOpen size={46} />
            <Brain size={33} />
            <Sparkles size={21} />
          </div>
          <h2>Learn. Grow. Achieve.</h2>
          <p>Practical learning, one milestone at a time.</p>
        </div>

        <div className="about-copy">
          <span className="eyebrow">OUR PRINCIPLES</span>
          <h2>
            Clarity is part of <em>good learning.</em>
          </h2>
          {[
            ["Practical first", "Learn concepts, then apply them through exercises and projects."],
            ["Support with context", "Know what mentors, learning resources and career support are included."],
            ["Honest outcomes", "Make decisions based on clear course details—not guaranteed job claims."],
          ].map(([heading, text]) => (
            <div className="principle" key={heading}>
              <CheckCircle2 />
              <div>
                <b>{heading}</b>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  const FAQPage = () => (
    <main className="page-main container">
      <div className="page-intro">
        <span className="eyebrow">HELP CENTRE</span>
        <h1>
          Questions worth <em>asking.</em>
        </h1>
        <p>Review these answers and confirm course-specific details in writing before enrolment.</p>
      </div>

      <div className="faq-page-list">
        {FAQS.map(([question, answer], index) => (
          <div className={`faq-item ${faqOpen === index ? "open" : ""}`} key={question}>
            <button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}>
              {question}
              <ChevronDown size={18} />
            </button>
            {faqOpen === index && <p>{answer}</p>}
          </div>
        ))}
      </div>

      <div className="notice-card">
        <CircleHelp size={22} />
        <div>
          <b>Need a specific answer?</b>
          <p>Request a counselling call to discuss your course, schedule, pricing and written terms.</p>
          <Button onClick={() => setModal("lead")}>
            Request counselling <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </main>
  );

  const Terms = () => (
    <main className="page-main container">
      <div className="page-intro">
        <span className="eyebrow">LEARNER POLICIES</span>
        <h1>
          Know the terms <em>before you enrol.</em>
        </h1>
        <p>This prototype provides a policy checklist, not legal terms. Publish reviewed policies before accepting real payments or learner data.</p>
      </div>

      <div className="terms-list">
        {[
          ["Course information", "Publish the syllabus, prerequisites, duration, teaching format, class schedule, access period and included learning resources."],
          ["Fees and payment", "Display the final payable amount, taxes, payment provider, receipt process and any instalments or additional charges."],
          ["Cancellation and refunds", "Provide a clear written cancellation and refund policy, including deadlines, exclusions and the process for raising a request."],
          ["Completion and certificates", "State completion criteria, attendance or assessment rules, certificate eligibility and expected processing time."],
          ["Career support", "Specify which services are included, eligibility, duration and exclusions. Do not imply guaranteed employment."],
          ["Privacy and data", "Explain what learner information is collected, why it is used, how long it is retained and how learners can request help."],
        ].map(([heading, text], index) => (
          <article key={heading}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{heading}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );

  const ThankYou = () => (
    <main className="thankyou container">
      <div className="thankyou-icon">
        <CheckCircle2 size={42} />
      </div>
      <span className="eyebrow">REQUEST RECEIVED</span>
      <h1>
        Your next step starts <em>with a conversation.</em>
      </h1>
      <p>Your request has been saved in this browser prototype. No email or notification has been sent and no live counselling appointment has been booked.</p>
      <div className="thankyou-actions">
        <Button onClick={() => go("catalogue")}>
          Explore courses <ArrowRight size={16} />
        </Button>
        <Button variant="outline" onClick={() => go("home")}>
          Back to home
        </Button>
      </div>
    </main>
  );

  return (
    <>
      <Header />
      {page === "home" && <Home />}
      {page === "catalogue" && <Catalogue />}
      {page === "course" && <CourseDetail />}
      {page === "journey" && <Journey />}
      {page === "learning" && <Learning />}
      {page === "checkout" && <Checkout />}
      {page === "career" && <Career />}
      {page === "about" && <About />}
      {page === "faq" && <FAQPage />}
      {page === "terms" && <Terms />}
      {page === "thankyou" && <ThankYou />}
      {page !== "learning" && <Footer />}

      {modal === "lead" && (
        <div className="modal-backdrop" onClick={() => setModal("")}>
          <div className="lead-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close form" onClick={() => setModal("")}>
              <X size={20} />
            </button>

            <div className="modal-side">
              <div className="modal-logo">
                <BookOpen size={35} />
                <Sparkles size={18} />
              </div>
              <span className="eyebrow light">LET'S FIND YOUR PATH</span>
              <h2>A little clarity can change your next step.</h2>
              <p>Tell us what you're exploring. This demo form saves the request in your browser only.</p>
              <div className="modal-perk">
                <CheckCircle2 /> No obligation to enrol
              </div>
              <div className="modal-perk">
                <CheckCircle2 /> Ask about syllabus and fees
              </div>
            </div>

            <form className="lead-form" onSubmit={submitLead}>
              <span className="eyebrow">FREE DEMO / COUNSELLING</span>
              <h2>Let's get to know you.</h2>
              <p>Fields marked * are required.</p>

              <label>
                Full name *
                <input required value={leadForm.name} onChange={(e) => setFormField("name", e.target.value)} placeholder="Your name" />
              </label>

              <div className="form-row">
                <label>
                  Email address *
                  <input required type="email" value={leadForm.email} onChange={(e) => setFormField("email", e.target.value)} placeholder="you@example.com" />
                </label>
                <label>
                  Phone number *
                  <input required type="tel" pattern="[0-9+() -]{8,18}" value={leadForm.phone} onChange={(e) => setFormField("phone", e.target.value)} placeholder="+91 98765 43210" />
                </label>
              </div>

              <label>
                Course interest *
                <select value={leadForm.interest} onChange={(e) => setFormField("interest", e.target.value)}>
                  {COURSES.map((course) => (
                    <option key={course.id}>{course.title}</option>
                  ))}
                </select>
              </label>

              <label>
                What would you like to do?
                <select value={leadForm.goal} onChange={(e) => setFormField("goal", e.target.value)}>
                  <option>Explore a course</option>
                  <option>Book a free demo</option>
                  <option>Talk to a counsellor</option>
                  <option>Understand fees and enrolment</option>
                </select>
              </label>

              <label className="consent">
                <input type="checkbox" checked={leadForm.consent} onChange={(e) => setFormField("consent", e.target.checked)} />
                <span>I agree to the demo request and understand this is a prototype form.</span>
              </label>

              <Button type="submit">Request a callback</Button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}
          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
