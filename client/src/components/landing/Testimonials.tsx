function Testimonials() {
  const reviews = [
    {
      name: "Alex T.",
      role: "Pro Gamer",
      text: "This is the best mousepad I've ever used. The surface is perfect for gaming and the stitched edges prevent fraying. Highly recommend!",
    },
    {
      name: "Sarah K.",
      role: "Graphic Designer",
      text: "The extended desk mat completely transformed my workspace. Great quality and the design is stunning.",
    },
    {
      name: "Mark J.",
      role: "Software Developer",
      text: "Fast shipping and excellent customer service. The cable management system is a game-changer for my setup.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-surface-500 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TechPad for their setup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group relative bg-surface-50 rounded-2xl p-6 sm:p-8 border border-surface-200 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-primary-200 text-4xl font-serif leading-none select-none">
                &ldquo;
              </div>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-surface-600 mb-6 leading-relaxed relative z-10">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-surface-900 text-sm">{review.name}</p>
                  <p className="text-xs text-surface-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
