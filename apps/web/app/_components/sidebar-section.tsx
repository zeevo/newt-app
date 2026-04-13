import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@newt-app/ui/components/sidebar';
import { cn } from '@newt-app/ui/lib/utils';

export type Item = {
  title: string;
  url: string;
};

export function SidebarSection({
  items,
  title,
  className,
  children,
}: {
  items: Item[];
  title: string;
  className?: string;
  children: (thing: Item) => React.ReactNode;
}): React.ReactElement {
  return (
    <SidebarGroup className={cn('p-0', className)}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>{children(item)}</SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
