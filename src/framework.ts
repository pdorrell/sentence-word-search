import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as Mobx from 'mobx';
import * as MobxReactLite from 'mobx-react-lite';
import * as UseGesture from '@use-gesture/react';
import * as DialogNS from '@radix-ui/react-dialog';

export type Framework = {
  StrictMode: typeof React.StrictMode;
  useEffect: typeof React.useEffect;
  useRef: typeof React.useRef;
  useState: typeof React.useState;
  createRoot: typeof ReactDOMClient.createRoot;
  makeAutoObservable: typeof Mobx.makeAutoObservable;
  observer: typeof MobxReactLite.observer;
  useDrag: typeof UseGesture.useDrag;
  Dialog: typeof DialogNS;
};

const theFramework: Framework = {
  StrictMode: React.StrictMode,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useState: React.useState,
  createRoot: ReactDOMClient.createRoot,
  makeAutoObservable: Mobx.makeAutoObservable,
  observer: MobxReactLite.observer,
  useDrag: UseGesture.useDrag,
  Dialog: DialogNS,
};

export const {
  StrictMode,
  useEffect,
  useRef,
  useState,
  createRoot,
  makeAutoObservable,
  observer,
  useDrag,
  Dialog,
} = theFramework;

export type { ChangeEvent, FC, FormEvent, KeyboardEvent } from 'react';
