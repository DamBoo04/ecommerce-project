export default function Carousel() {
  return (
    <section class="py-8 pt-24 antialiased">
      <div class="mx-auto grid max-w-screen-xl px-4 md:grid-cols-12 lg:gap-12 lg:pb-16 xl:gap-0">
        <div class="content-center justify-self-start md:col-span-7 md:text-start">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight md:max-w-2xl md:text-5xl xl:text-6xl">
            Limited Time Offer!
            <br />
            Up to 50% OFF!
          </h1>
          <p class="mb-4 max-w-2xl text-gray-600 md:mb-12 md:text-lg mb-3 lg:mb-5 lg:text-xl">
            Don't Wait - Limited Stock at Unbeatable Prices!
          </p>
          <a
            href="#"
            class="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3.5 text-center font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
          >
            Shop Now
          </a>
        </div>
        <div class="hidden md:col-span-5 md:mt-0 md:flex bg-yellow-400 rounded-lg p-4">
          <img
            src="https://www.customink.com/assets/site_content/pages/home/marquee/febsweats/xl-cc188f572809320a5a17ea4c353f91f21401be3c27f9fb85b0458f178438bed3.webp"
            alt="shopping illustration"
          />
        </div>
      </div>
    </section>
  );
}
