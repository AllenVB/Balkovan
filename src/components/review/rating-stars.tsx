import { Icon } from "@/components/ui/icon";

/**
 * Yildiz gostergesi. Yarim yildiz cizmek yerine puani yuvarlar; tasarimda
 * yildizlar dolu/bos olarak geciyor.
 */
export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const filled = Math.round(rating);

  return (
    <div
      className={`flex text-amber-deep ${className ?? ""}`}
      role="img"
      aria-label={`5 üzerinden ${rating} puan`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          name="star"
          filled={index < filled}
          className={index < filled ? undefined : "text-outline-variant"}
        />
      ))}
    </div>
  );
}
