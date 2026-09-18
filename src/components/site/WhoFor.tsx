import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCallModal } from "@/components/BookCallModal";

export function WhoFor() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-20 lg:py-24">
      <div className="section-x text-center">
        <h2 className="text-4xl font-semibold text-foreground sm:text-[44px]">
          Who is 360 Biz Health for?
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-ink sm:text-2xl">
          Perfect for <strong className="font-semibold">people leaders, CXOs, and founders</strong>{" "}
          looking to take better care of their team
          <Heart className="ml-1 inline size-5 fill-brand text-brand" />
        </p>
        <Button
          variant="brand"
          size="pill"
          className="mt-10 cursor-pointer shadow-lg shadow-brand/20 transition-all hover:scale-[1.03]"
          onClick={() => setModalOpen(true)}
        >
          Book A Call Now
        </Button>
      </div>

      <BookCallModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}

export default WhoFor;
