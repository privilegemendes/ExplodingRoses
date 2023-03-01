import * as React from "react";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";

import * as config from "../../lib/config";

import styles from "../../styles/styles.module.css";
import { LogoFooter } from "../Logo/Logo";


type Props = {
  darkMode?: boolean
}

export const FooterImpl: React.FC<Props> = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerHeader}>
          <LogoFooter/>
          <div className={styles.copyright}>© 2023-Present {config.author}. All rights reserved.</div>
        </div>
        <div className={styles.social}>
          {config.twitter && (
            <a
              className={styles.twitter}
              href={`https://twitter.com/${config.twitter}`}
              title={`Twitter @${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaTwitter />
            </a>
          )}
          {config.github && (
            <a
              className={styles.github}
              href={`https://github.com/${config.github}`}
              title={`GitHub @${config.github}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub />
            </a>
          )}
          {config.linkedin && (
            <a
              className={styles.linkedin}
              href={`https://www.linkedin.com/in/${config.linkedin}`}
              title={`LinkedIn ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin />
            </a>
          )}
        </div>
        <div className={styles.copyrightBottom}>© 2023-Present {config.author}. All rights reserved.</div>
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
