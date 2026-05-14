interface Props {
  total: number;
}

export const NotificacionChat = ({ total }: Props) => {
  if (total === 0) {
    return null;
  }

  const label = total > 99 ? "99+" : `${total}`;

  return (
    <div className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-[0.4rem] text-[0.65rem] font-semibold text-white">
      {label}
    </div>
  );
};
