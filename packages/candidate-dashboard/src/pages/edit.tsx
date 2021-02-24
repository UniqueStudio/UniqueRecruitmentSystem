import { makeStyles } from '@material-ui/core';
import EditForm from 'components/EditForm';

const useStyle = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
}));

export default function Edit() {
  const styles = useStyle();
  const data = {};
  return (
    <div className={styles.root}>
      <EditForm data={data} />
    </div>
  );
}
