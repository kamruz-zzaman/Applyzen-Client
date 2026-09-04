import { avatarColorClasses, initials } from "@/lib/avatar-color";

export function Avatar({
  image,
  name,
  size = 32,
}: {
  image?: string | null;
  name: string;
  size?: number;
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL, not an optimizable static asset
    return (
      <img
        src={image}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${avatarColorClasses(name || "?")}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(name || "?")}
    </span>
  );
}
