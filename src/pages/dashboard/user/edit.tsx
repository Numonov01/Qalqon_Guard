import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentUser = _userList
    .map((user) => ({
      ...user,
      avatar: user.avatarUrl,
      phone: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      age: user.age,
      height: user.height,
      weight: user.weight,
      armLength: user.armLength,
      legLength: user.legLength,
      gender: user.gender === 'male' || user.gender === 'female' ? user.gender : 'male',
      status: ['pending', 'banned', 'active', 'inactive'].includes(user.status)
        ? (user.status as 'pending' | 'banned' | 'active' | 'inactive')
        : 'inactive',
    }))
    .find((user) => user.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={currentUser} />
    </>
  );
}
