import Link from "next/link";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const inThreeWeeks = new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--page)" }}>
      <section style={{ backgroundColor: "var(--brand)" }} className="text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Find a place to stay</h1>

          <form method="GET" action="/stays" className="bg-white rounded p-4 flex flex-col gap-4 md:flex-row md:gap-2">
            <div className="flex-1">
              <label className="block text-xs font-500 mb-1" style={{ color: "var(--ink)" }}>
                Destination
              </label>
              <input
                type="text"
                name="destination"
                placeholder="Enter city"
                defaultValue="Dar es Salaam"
                className="w-full px-3 py-2 text-sm"
                style={{ color: "var(--ink)" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-500 mb-1" style={{ color: "var(--ink)" }}>
                Check in
              </label>
              <input
                type="date"
                name="check_in"
                defaultValue={inTwoWeeks}
                className="w-full px-3 py-2 text-sm"
                style={{ color: "var(--ink)" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-500 mb-1" style={{ color: "var(--ink)" }}>
                Check out
              </label>
              <input
                type="date"
                name="check_out"
                defaultValue={inThreeWeeks}
                className="w-full px-3 py-2 text-sm"
                style={{ color: "var(--ink)" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-500 mb-1" style={{ color: "var(--ink)" }}>
                Guests
              </label>
              <input
                type="number"
                name="guests"
                defaultValue="2"
                min="1"
                max="10"
                className="w-full px-3 py-2 text-sm"
                style={{ color: "var(--ink)" }}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 text-white font-500 text-sm rounded"
                style={{ backgroundColor: "var(--action)" }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--ink)" }}>
          Popular destinations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Dar es Salaam", "Zanzibar", "Nairobi", "Dubai", "Chandigarh", "Delhi", "Paris", "Istanbul"].map((city) => (
            <Link
              key={city}
              href={`/stays?destination=${city}&check_in=${inTwoWeeks}&check_out=${inThreeWeeks}&guests=2&rooms=1`}
              className="p-4 rounded border text-center hover:bg-gray-50"
              style={{ borderColor: "var(--line)", backgroundColor: "white" }}
            >
              <p className="font-500" style={{ color: "var(--ink)" }}>
                {city}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                5 properties
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
