import { Avatar } from './ui/avatar'
import Image from 'next/image'
import type { AvatarProps } from '@radix-ui/react-avatar';
import type { User } from 'next-auth'

type Props = Partial<AvatarProps> & {
    user: User | undefined;
};

const UserAvatar = ({ user, ...avatarProps }: Props)  => {
  return (
    <Avatar className="relative h-8 w-8" {...avatarProps}>
        <Image
            src={user?.image || "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
            }
            fill
            alt={`${user?.name}'s profile picture`}
            className="rounded-full object-cover"
        />
    </Avatar>
  )
}

export default UserAvatar

// https://z-p42-instagram.fdur1-1.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ad=z-m&_nc_ht=z-p42-instagram.fdur1-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=vKyah88pW8EQ7kNvgGC1DcY&edm=AJttv-UBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AYBKoS5r6cemJSdE93ndR-PgVC56JgK6i7x3BaKtGBU_Ag&oe=6689190F&_nc_sid=ef1dd0


// https://instagram.fsaw2-2.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fsaw2-2.fna.fbcdn.net&_nc_cat=1&_nc_ohc=vKyah88pW8EQ7kNvgE516qL&edm=ALlQn9MBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AYAeI9IXHeVB_s53UIdgFFjaZeBqRB5vtTSZElOelDCUew&oe=6689190F&_nc_sid=e7f676

// https://instagram.fbgw41-1.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fbgw41-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=vKyah88pW8EQ7kNvgFmB9e9&edm=APcnxpQBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AYAcSWCMyGG0gCDJXoAoT6wSer9h4f91JQsHDwuPyykSkQ&oe=6689190F&_nc_sid=a1bb5f