import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Link, { LinkProps } from 'next/link';
import { FC, MouseEventHandler, ReactNode } from 'react';

export interface ListItemLinkProps {
    icon?: ReactNode;
    primary: ReactNode;
    href: LinkProps['href'];
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const ListItemLink: FC<ListItemLinkProps> = ({ icon, primary, href, onClick }) => {
    return (
        <Link href={href} passHref>
            <ListItem button component='a' onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={primary} />
            </ListItem>
        </Link>
    );
};

export default ListItemLink;
export { ListItemLink };
