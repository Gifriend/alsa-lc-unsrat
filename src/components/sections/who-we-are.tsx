export default function WhoWeAre() {
  return (
    <section className="section-spacing bg-white section-divider">
      <div className="container-custom">
        <h2>Who We Are</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-neutral-medium mb-4 leading-relaxed">
              ALSA is a non-political, non-profit association that welcomes cultural diversity, advances the
              professionalism and hard-working ethic in which are the evident characteristic of Asians.
            </p>
            <p className="text-neutral-medium mb-4 leading-relaxed">
              ALSA has become and is continually improving as a premier association that provides the venue for bright
              law students to connect and develop as future leaders and major players of Asia.
            </p>
            <p className="text-neutral-medium mb-4 leading-relaxed">
              Founded in 1989, ALSA Indonesia is a full and founding member of ALSA and divided into 15 Local Chapters
              of Universities in Indonesia. Our local chapter at Universitas Sam Ratulangi continues to grow and set
              examples on how law students should be prepared to fit in the global area.
            </p>
          </div>
          <div className="bg-neutral-light p-8 rounded">
            <div className="space-y-6">
              <div>
                <h3 className="text-primary font-serif text-xl font-bold mb-2">Vision</h3>
                <ul className="space-y-2 text-neutral-medium">
                  <li>• Focus on a global vision on the promising future of Asia</li>
                  <li>• Promote awareness of justice</li>
                  <li>• Facilitate recognition of social responsibilities of law students</li>
                </ul>
              </div>
              <div>
                <h3 className="text-primary font-serif text-xl font-bold mb-2">Objectives</h3>
                <ul className="space-y-2 text-neutral-medium text-sm">
                  <li>• Understand and appreciate diversity through exchange and communication</li>
                  <li>• Motivate development of creative spirit through networks</li>
                  <li>• Encourage enhancement of capabilities for international mindedness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
