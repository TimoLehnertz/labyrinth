export default function SideBar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="flex flex-col justify-between h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div>{children}</div>
        <div>test</div>
      </div>
    </aside>
  );
}
