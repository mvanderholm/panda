import NavBar from './NavBar';

export default function Layout({ children }) {
  return (
    <div style={styles.page}>
      <NavBar />
      <main style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f4f6f9' },
  main: { padding: '2rem 1.5rem' },
  content: { maxWidth: '1200px', margin: '0 auto' },
};