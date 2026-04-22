import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as Mobx from 'mobx';
import * as MobxReactLite from 'mobx-react-lite';
import * as UseGesture from '@use-gesture/react';
import * as DialogNS from '@radix-ui/react-dialog';
import type { FC, ReactNode } from 'react';

type SetState<T> = (next: T | ((prev: T) => T)) => void;
type Ref<T> = { current: T | null };
type Cleanup = () => void;

type ReactRoot = {
  render(children: ReactNode): void;
  unmount(): void;
};

type DialogRootProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

type DialogChildrenProps = {
  children?: ReactNode;
};

type DialogOverlayProps = {
  className?: string;
};

type DialogContentProps = {
  className?: string;
  children?: ReactNode;
};

type DialogAsChildProps = {
  asChild?: boolean;
  children?: ReactNode;
};

type DialogNamespace = {
  Root: FC<DialogRootProps>;
  Portal: FC<DialogChildrenProps>;
  Overlay: FC<DialogOverlayProps>;
  Content: FC<DialogContentProps>;
  Title: FC<DialogAsChildProps>;
  Description: FC<DialogAsChildProps>;
  Close: FC<DialogAsChildProps>;
};

type DragState = {
  first: boolean;
  last: boolean;
  event: PointerEvent | MouseEvent | TouchEvent;
};

type DragBindings = Record<string, unknown>;

type Annotation = unknown;

export type Framework = {
  StrictMode: FC<{ children?: ReactNode }>;
  useEffect: (effect: () => void | Cleanup, deps?: ReadonlyArray<unknown>) => void;
  useRef: <T>(initial: T | null) => Ref<T>;
  useState: <T>(initial: T) => [T, SetState<T>];
  createRoot: (container: Element | DocumentFragment) => ReactRoot;
  makeObservable: <T extends object>(target: T, annotations?: Record<string, Annotation>) => T;
  observable: Annotation;
  computed: Annotation;
  action: Annotation;
  observer: <P>(component: FC<P>) => FC<P>;
  useDrag: (handler: (state: DragState) => void) => () => DragBindings;
  Dialog: DialogNamespace;
};

const theFramework: Framework = {
  StrictMode: React.StrictMode,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useState: React.useState,
  createRoot: ReactDOMClient.createRoot,
  makeObservable: Mobx.makeObservable as Framework['makeObservable'],
  observable: Mobx.observable,
  computed: Mobx.computed,
  action: Mobx.action,
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
  makeObservable,
  observable,
  computed,
  action,
  observer,
  useDrag,
  Dialog,
} = theFramework;

export class Store {}

export type { ChangeEvent, FC, FormEvent, KeyboardEvent } from 'react';
