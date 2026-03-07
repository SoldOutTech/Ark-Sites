import { types } from "react-bricks/frontend";

// LAYOUT
import Hero from "./Hero";
import VideoHero from "./VideoHero";
import TextHero from "./TextHero";
import NavigationBar from "./Navigation/NavigationBar";
import Footer from "./Footer/Footer";
import FooterColumn from "./Footer/FooterColumn";
import FooterColumnLink from "./Footer/FooterColumnLink";
import FooterSocialLink from "./Footer/FooterSocialLink";
import EventInfoHero from "./EventInfoHero";
import ItemGrid from "./ItemGrid";
import PhotoGridItem from "./Components/PhotoGridItem";
import TextSection from "./TextSection";
import ProfileGridItem from "./Profile/ProfileGridItem";
import IconLink from "./Components/IconLink";
import CollapsibleTextBlock from "./Collapsible/CollapsibleTextBlock";
import Timeline from "./Timeline/Timeline";
import TimelineItem from "./Timeline/TimelineItem";
import HeroProfile from "./Profile/HeroProfile";
import HorizontalProfile from "./Profile/HorizontalProfile";
import ButtonLink from "./Components/ButtonLink";
import CollapsibleHeroBlock from "./Collapsible/CollapsibleHeroBlock";
import NavigationBarItem from "./Navigation/NavigationBarItem";
import IconHeroProfile from "./Profile/IconHeroProfile";
import PhotoGallery from "./PhotoGallery";
import { ArKUIColours } from "./colors";
import type { ArkUIColourValue } from "./colors";
import {
  ArticleBody,
  AUTHORS,
  POST_CATEGORIES,
  PostAuthor,
  PostList,
  PostMetadata,
  PostsProvider,
  usePosts,
} from "./Blog";

// Theme structure
const allBricks: types.Theme = {
  themeName: "Ark UI",
  categories: [
    {
      categoryName: "Content",
      bricks: [TextSection, CollapsibleTextBlock, PhotoGallery],
    },
    {
      categoryName: "Timeline",
      bricks: [Timeline, TimelineItem],
    },
    {
      categoryName: "Hero Sections",
      bricks: [Hero, TextHero, VideoHero, EventInfoHero, ButtonLink],
    },
    {
      categoryName: "Profile Sections",
      bricks: [HeroProfile, IconHeroProfile, HorizontalProfile],
    },
    {
      categoryName: "Page Sections",
      bricks: [
        ItemGrid,
        PhotoGridItem,
        ProfileGridItem,
        IconLink,
        CollapsibleHeroBlock,
      ],
    },
    {
      categoryName: "Layout",
      bricks: [
        NavigationBar,
        NavigationBarItem,
        Footer,
        FooterColumn,
        FooterColumnLink,
        FooterSocialLink,
      ],
    },
    {
      categoryName: "Blog",
      bricks: [PostList, ArticleBody, PostAuthor, PostMetadata],
    },
  ],
};

// Public exports for app-level usage without importing internal dist paths.
export {
  ArticleBody,
  AUTHORS,
  ArKUIColours,
  IconLink,
  POST_CATEGORIES,
  PostAuthor,
  PostList,
  PostMetadata,
  PostsProvider,
  usePosts,
};
export type { ArkUIColourValue };
export type { Author, PostCategory, PostsContextType } from "./Blog";
export default allBricks;
