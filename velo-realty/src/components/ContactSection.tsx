export function ContactSection() {
  return (
    <section id="contact" className="section cta">
      <div className="container cta-wrap">
        <div>
          <p className="eyebrow">Talk to an advisor</p>
          <h2>Book your consultation</h2>
          <p>Tell us your goal and we will match you with a specialist consultant.</p>
        </div>
        <form
          className="lead-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label>
            Full name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Phone
            <input type="tel" placeholder="+971" />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Message
            <textarea placeholder="Investment preference, community, budget..." />
          </label>
          <button className="btn btn-primary" type="submit">
            Submit enquiry
          </button>
        </form>
      </div>
    </section>
  )
}
