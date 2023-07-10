import prismaDb from '@/lib/prismadb';
import { type IParams } from '@/app/shared/interfaces';
import ColorForm from '@/app/(dashboard)/components/ColorForms';

interface Props {
  params: IParams;
}

async function ColorPage({ params }: Props): Promise<JSX.Element> {
  const color = await prismaDb.color.findUnique({ where: { id: params.colorId } });

  return (
    <div className='flex-col flex-1 space-y-4 p-8 pt-6'>
      <ColorForm color={color} />
    </div>
  );
}
export default ColorPage;
