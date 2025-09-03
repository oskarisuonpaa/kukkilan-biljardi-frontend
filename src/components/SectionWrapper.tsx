type SectionWrapperProps = {
  title: string;
  headerChildren?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  headerChildren,
  children,
}) => (
  <section>
    <header>
      <h2>{title}</h2>
      <div className="section-underline mb-6" aria-hidden="true" />
      {headerChildren}
    </header>
    {children}
  </section>
);

export default SectionWrapper;
