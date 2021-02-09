import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { FC } from 'react';
import Link, { LinkProps } from 'next/link';

export interface ListItemLinkProps {
  icon?: React.ReactNode;
  primary: React.ReactNode;
  href: LinkProps['href'];
}

const ListItemLink: FC<ListItemLinkProps> = ({ icon, primary, href }) => {
  return (
    <Link href={href} passHref>
      <ListItem button component='a'>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={primary} />
      </ListItem>
    </Link>
  );
};

export default ListItemLink;
export { ListItemLink };
