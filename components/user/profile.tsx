import { bannerResolver, clsx, evalBadges, evalFlags } from 'lib/constants';
import MarkDown from 'lib/markdown';
import useAtagWatch from 'lib/useAtagWatch';
import { userData } from 'models/users';
import React from 'react';
import styles from 'styles/profile.module.scss';

interface props {
  profile: userData;
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);
  const [user, tag] = profile.tag.split('#');

  const bannerData = bannerResolver(profile.banner);

  useAtagWatch(profile.description);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <div>
          {bannerData.type === 'img' && (
            <div
              className={styles.banner}
              style={{
                backgroundImage: `url(${bannerData.image})`,
                backgroundSize: '100% ',
                minWidth: '600px',
                backgroundPosition: 'center center',
              }}
            />
          )}
          {bannerData.type === 'color' && (
            <div
              className={styles.banner}
              style={{
                backgroundColor: bannerData.color,
              }}
            />
          )}
          {bannerData.type === 'unknown' && (
            <div className={styles.banner}>
              <h1>ERROR! Unknow banner type!</h1>
            </div>
          )}
        </div>
        <img
          className={styles.pfp}
          draggable={false}
          src={profile.avatarURL}
          alt='User avatar'
          onError={({ currentTarget }) => {
            // eslint-disable-next-line no-param-reassign
            currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${
              +profile.discriminator % 5
            }.png`;
          }}
        />
        <div className={styles.profile}>
          <h2>
            {user}
            <span className={styles.tag}>#{tag}</span>
          </h2>

          <div className={styles.badges}>
            {/* Reverse as on pass in of the profile data the order is reversed */}
            {badges.reverse().map(
              ([badge, displayName], i) =>
                badge !== null && (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={`badges${i}`}>
                    <span>{displayName}</span>
                    {badge}
                  </span>
                )
            )}
          </div>
          <div className={styles.bio}>
            <h3>🖋 About</h3>
            <div
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{
                __html: new MarkDown(profile.description).render(),
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
