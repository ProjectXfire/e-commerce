'use client';

import { useParams } from 'next/navigation';
import { useOrigin } from '../../hooks';
import ApiAlert from './ApiAlert';

interface Props {
  entityName: string;
  entityIdName: string;
}

function ApiList({ entityIdName, entityName }: Props): JSX.Element {
  const origin = useOrigin();
  const params = useParams();

  const baseUrtl = `${origin}/api/${params.id}`;

  return (
    <div className='flex gap-4 flex-col'>
      <ApiAlert title='GET' variant='public' description={`${baseUrtl}/${entityName}`} />
      <ApiAlert
        title='GET'
        variant='public'
        description={`${baseUrtl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert title='POST' variant='admin' description={`${baseUrtl}/${entityName}`} />
      <ApiAlert
        title='PATCH'
        variant='admin'
        description={`${baseUrtl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title='DELETE'
        variant='admin'
        description={`${baseUrtl}/${entityName}/{${entityIdName}}`}
      />
    </div>
  );
}
export default ApiList;
